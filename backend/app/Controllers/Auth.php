<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
{
    public function login()
    {
        $data = $this->request->getJSON(true);

        // Validate email and password input
        if (
            !is_string($data['email']) || $data['email'] === '' || 
            !is_string($data['password']) || $data['password'] === ''
        ) {
            return $this->failValidationErrors('Email and password are required');
        }

        $model = model(UserModel::class);

        // Find user by email
        $user = $model->where('email', $data['email'])->first();

        // Check if the user's email is in the database
        if (!$user) {
            return $this->failUnauthorized('Invalid credentials');
        }

        // Verify password
        if (!password_verify($data['password'], $user['password_hash'])) {
            return $this->failUnauthorized('Invalid credentials');
        }

        // Set session
        $session = session();
        $session->regenerate();

        $session->set([
            'id' => $user['id'],
            'isLoggedIn' => true,
            'last_activity' => time(),
        ]);

        return $this->respond([
            'message' => 'Login successful',
            'id' => $user['id'],
        ]);
    }

    public function logout()
    {
        session()->destroy();

        return $this->respond([
            'message' => 'Logged out',
        ]);
    }

    public function me()
    {
        $session = session();

        if (!$session->get('isLoggedIn')) {
            return $this->failUnauthorized('Not logged in');
        }

        return $this->respond([
            'id' => $session->get('id'),
        ]);
    }

    public function timeout()
    {
        $session = session();

        if (!$session->get('isLoggedIn')) {
            return $this->failUnauthorized('Not logged in');
        }

        // Check timeout and log out the user
        if (time() - $session->get('last_activity') > 3600) {
            $session->destroy();
            return $this->failUnauthorized('Session expired');
        }

        // Update last activity time
        $session->set('last_activity', time());
        return $this->respond([
            'message' => 'Session active'
        ]);
    }
}