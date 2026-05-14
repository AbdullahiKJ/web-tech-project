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

    public function showUser($slug)
    {
        $model = model(UserModel::class);

        $data = $model->getUser($slug);
        return $this->respond($data);
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

    public function update($id = null, $type = null)
    {
        helper('form');
        $model = model(UserModel::class);

        // Check if the user exists
        $user = $model->find($id);
        if ($user == null)
            return $this->failNotFound("User not found");

        // Get the update data
        $data = $this->request->getJSON(true);

        // Check what user data is changing, 1 is the user name
        if($type == 1)
        {
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
        // 2 is the user's password
        else if($type == 2)
        {
            // Validate input types, ensuring they are both strings and not empty
            if (!is_string($data['existing_password']) || $data['existing_password'] === '' ||
                !is_string($data['password']) || $data['password'] === '') {
                return $this->respondNoContent();
            }

            if (!is_string($user['password_hash']) || $user['password_hash'] === '') {
                return $this->respondNoContent();
            }

            // Check if the existing password is correct, return if it is not
            if (!password_verify($data['existing_password'], $user['password_hash'])) {
                return $this->respond(data:null, status:401, message:"Incorrect Password");
            }

            // Get the current password hash and compare, return if they are the same
            if (password_verify($data['password'], $user['password_hash'])) {
                return $this->respond(data:null, status:401, message:"The old and new password are the same, try again");
            }

            // Hash the new password
            $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

            // Save changes to the database
            $model->update($id, [
                'password_hash'  => $passwordHash,
            ]);

            // The password has been updated, return success (201)
            return $this->respondCreated(
                message: 'Password updated',
            );
        }

        // Fallback
        return $this->respondNoContent();
    }
}
