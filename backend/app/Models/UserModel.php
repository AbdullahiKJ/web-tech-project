<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $allowedFields = ['id', 'name', 'email', 'password_hash', 'display_name'];

    public function getUser($slug)
    {
        return $this->find($slug);
    }
}
