<?php

namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

class PasswordResetTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    protected function setUp(): void
    {
        parent::setUp();
        $forge = \Config\Database::forge('tests');
        $forge->dropTable('password_resets', true);
        $forge->dropTable('users', true);
        $forge->addField([
            'id' => ['type' => 'VARCHAR', 'constraint' => 255],
            'email' => ['type' => 'VARCHAR', 'constraint' => 255],
            'password_hash' => ['type' => 'VARCHAR', 'constraint' => 255],
        ]);
        $forge->addKey('id', true);
        $forge->createTable('users');
        // Create the schema only in the isolated test database.
        $forge->addField([
            'token_hash' => ['type' => 'VARCHAR', 'constraint' => 64],
            'user_id' => ['type' => 'VARCHAR', 'constraint' => 255],
            'password_hash' => ['type' => 'VARCHAR', 'constraint' => 255],
            'expires_at' => ['type' => 'INT'],
        ]);
        $forge->addKey('token_hash', true);
        $forge->addKey('expires_at');
        $forge->createTable('password_resets');
        db_connect()->table('users')->insert([
            'id' => 'test-user', 'email' => 'test@example.com',
            'password_hash' => password_hash('OldPassword1!', PASSWORD_DEFAULT),
        ]);
    }

    private function token(int $expiry): string
    {
        $token = bin2hex(random_bytes(32));
        $user = db_connect()->table('users')->get()->getRowArray();
        db_connect()->table('password_resets')->insert([
            'token_hash' => hash('sha256', $token), 'user_id' => $user['id'],
            'password_hash' => $user['password_hash'], 'expires_at' => $expiry,
        ]);
        return $token;
    }

    private function resetWith(string $token, string $password = 'NewPassword1!')
    {
        return $this->withBodyFormat('json')->post('/auth/reset-password', [
            'token' => $token, 'password' => $password, 'confirmPassword' => $password,
        ]);
    }

    public function testResetChangesPasswordAndCannotBeReused(): void
    {
        $token = $this->token(time() + 1800);
        $this->resetWith($token)->assertStatus(200);
        $user = db_connect()->table('users')->get()->getRowArray();
        $this->assertTrue(password_verify('NewPassword1!', $user['password_hash']));
        $this->resetWith($token)->assertStatus(400);
    }

    public function testExpiredAndInvalidTokensFail(): void
    {
        $this->resetWith($this->token(time() - 1))->assertStatus(400);
        $this->resetWith('invalid')->assertStatus(400);
    }

    public function testWeakPasswordDoesNotConsumeToken(): void
    {
        $token = $this->token(time() + 1800);
        $this->resetWith($token, 'weak')->assertStatus(400);
        $this->resetWith($token)->assertStatus(200);
    }

    public function testPasswordChangeInvalidatesLink(): void
    {
        $token = $this->token(time() + 1800);
        db_connect()->table('users')->where('id', 'test-user')->update([
            'password_hash' => password_hash('AnotherPassword1!', PASSWORD_DEFAULT),
        ]);
        $this->resetWith($token)->assertStatus(400);
    }

    public function testInvalidEmailIsRejected(): void
    {
        $this->withBodyFormat('json')->post('/auth/forgot-password', ['email' => []])->assertStatus(400);
    }
}
