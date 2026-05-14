<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Api extends ResourceController
{
    public function test()
    {
        return $this->respond([
            'message' => 'Backend working',
            'status' => 'success'
        ]);
    }
}
