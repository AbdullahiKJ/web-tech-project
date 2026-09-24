<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class PasswordReset extends ResourceController
{
    private const MESSAGE = 'If an account exists with that email, a password reset link will be sent.';

    private function payload(): array
    {
        try {
            $data = $this->request->getJSON(true);
            return is_array($data) ? $data : [];
        } catch (\Throwable $e) {
            return [];
        }
    }

    public function requestLink()
    {
        $data = $this->payload();
        $address = is_string($data['email'] ?? null) ? trim($data['email']) : '';
        if (strlen($address) > 254 || !filter_var($address, FILTER_VALIDATE_EMAIL)) {
            return $this->failValidationErrors('Please enter a valid email address.');
        }

        $throttler = service('throttler');
        if (!$throttler->check('reset-ip-' . hash('sha256', $this->request->getIPAddress()), 10, 3600)) {
            return $this->fail('Too many requests. Please try again later.', 429);
        }
        if (!$throttler->check('reset-email-' . hash('sha256', strtolower($address)), 1, 60)) {
            return $this->respond(['message' => self::MESSAGE]);
        }

        $base = rtrim((string) env('PASSWORD_RESET_URL', ''), '/');
        $emailConfig = config('Email');
        if (!filter_var($base, FILTER_VALIDATE_URL) || !preg_match('#^https?://#', $base)
            || !filter_var($emailConfig->fromEmail, FILTER_VALIDATE_EMAIL)) {
            log_message('error', 'Password reset URL or sender email is not configured.');
            return $this->failServerError('Password reset is temporarily unavailable.');
        }

        $user = model(UserModel::class)->where('email', $address)->first();
        if ($user) {
            $db = db_connect();
            $token = bin2hex(random_bytes(32));
            $hash = hash('sha256', $token);
            try {
                $db->table('password_resets')->where('expires_at <=', time())->delete();
                $saved = $db->table('password_resets')->insert([
                    'token_hash' => $hash,
                    'user_id' => $user['id'],
                    // Bind the link to the current password, invalidating it after any password change.
                    'password_hash' => $user['password_hash'],
                    'expires_at' => time() + 1800,
                ]);
                if (!$saved) {
                    throw new \RuntimeException('Could not save reset token.');
                }
                $mail = service('email');
                $mail->clear(true);
                $mail->setFrom($emailConfig->fromEmail, $emailConfig->fromName);
                $mail->setTo($user['email']);
                $mail->setMailType('text');
                $mail->setSubject('Reset your password');
                // A fragment keeps the token out of server access logs and referrer headers.
                $mail->setMessage("Reset your password using this link (expires in 30 minutes):\n\n"
                    . $base . '#token=' . $token
                    . "\n\nIf you did not request this, you can ignore this email.");
                if (!$mail->send()) {
                    throw new \RuntimeException('Could not send reset email.');
                }
            } catch (\Throwable $e) {
                $db->table('password_resets')->where('token_hash', $hash)->delete();
                log_message('error', 'Password reset delivery failed.');
            }
        }

        // Do not reveal whether the address is registered, including delivery failures.
        return $this->respond(['message' => self::MESSAGE]);
    }

    public function resetPassword()
    {
        $data = $this->payload();
        $token = $data['token'] ?? null;
        $password = $data['password'] ?? null;
        if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/D', $token)) {
            return $this->failValidationErrors('This reset link is invalid or has expired.');
        }
        if (!is_string($password) || strlen($password) < 8 || strlen($password) > 72
            || !preg_match('/[a-zA-Z]/', $password) || !preg_match('/[0-9]/', $password)
            || !preg_match('/[^a-zA-Z0-9]/', $password)) {
            return $this->failValidationErrors('Use 8–72 bytes with a letter, number and special character.');
        }
        if ($password !== ($data['confirmPassword'] ?? null)) {
            return $this->failValidationErrors('Passwords do not match.');
        }
        $db = db_connect();
        $hash = hash('sha256', $token);
        $reset = $db->table('password_resets')->where('token_hash', $hash)->get()->getRowArray();
        if (!$reset || (int) $reset['expires_at'] <= time()) {
            return $this->failValidationErrors('This reset link is invalid or has expired.');
        }

        $db->transBegin();
        try {
            // Conditional deletion and update prevent token reuse and concurrent resets.
            $db->table('password_resets')->where('token_hash', $hash)->where('expires_at >', time())->delete();
            if ($db->affectedRows() !== 1) {
                $db->transRollback();
                return $this->failValidationErrors('This reset link is invalid or has expired.');
            }
            $db->table('users')->where('id', $reset['user_id'])
                ->where('password_hash', $reset['password_hash'])
                ->update(['password_hash' => password_hash($password, PASSWORD_DEFAULT)]);
            if ($db->affectedRows() !== 1 || !$db->transStatus()) {
                $db->transRollback();
                return $this->failValidationErrors('This reset link is invalid or has expired.');
            }
            $db->table('password_resets')->where('user_id', $reset['user_id'])->delete();
            if (!$db->transStatus()) {
                throw new \RuntimeException('Reset transaction failed.');
            }
            $db->transCommit();
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'Password reset transaction failed.');
            return $this->failServerError('Unable to reset your password. Please try again.');
        }
        return $this->respond(['message' => 'Your password has been reset. You can now sign in.']);
    }
}
