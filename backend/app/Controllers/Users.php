<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class Users extends ResourceController
{
    public function create()
    {
        helper('form');

        // Get the post data
        $data = $this->request->getJSON(true);

        // Check if the user already exists in the database
        $model = model(UserModel::class);
        $userWithEmail = $model->where('email', $data['email'])->findAll();

        if ($userWithEmail != null) {
            // If the user is already registered, return 409 conflict error
            return $this->fail(
                messages: ['This email is already registered'],
                status: 409,
            );
        } else {
            // Hash the password
            $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

            // Generate a new user id and check if it is registered
            $userId = '';
            $idExists = true;
            while ($idExists) {
                $userId = uniqid();
                $idExists = $model->find($userId) != null;
            }

            // Save to the database
            $model->insert([
                'name' => $data['name'],
                'display_name' => $data['name'],
                'email'  => $data['email'],
                'password_hash'  => $passwordHash,
                'id' => $userId
            ]);

            // The user has been registered, return success (201)
            return $this->respondCreated(
                message: 'User created',
            );
        }
    }

    public function delete($id = null)
    {
        $model = model(UserModel::class);

        // Check if the user exists
        $user = $model->find($id);
        if ($user == null)
            return $this->failNotFound("User not found");

        // Delete the user
        if ($model->delete($id))
            return $this->respondDeleted([
                "message" => "User Deleted"
            ]);

        return $this->failServerError("Failed to delete");
    }

    public function update($id = null)
    {
        helper('form');
        $model = model(UserModel::class);

        // Check if the user exists
        $user = $model->find($id);
        if ($user == null)
            return $this->failNotFound("User not found");

        // Get the update data
        $data = $this->request->getJson(true);

        // Check if any of the inputs are null
        if ($data['name'] == null || $data['display_name'] == null)
            return $this->respondNoContent();

        // Check if any changes have been made
        if ($data['name'] == $user['name'] && $data['display_name'] == $user['display_name'])
            return $this->respondNoContent();

        // Save changes to the database
        $model->update(
            $id,
            [
                'name'  => $data['name'],
                'display_name'  => $data['display_name'],
            ]
        );

        // The review has been updated, return success (200)
        return $this->respondUpdated([
            "message" => "User updated",
        ]);
    }
}
