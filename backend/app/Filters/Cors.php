<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $origin = getenv('CORS_ORIGIN');

        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
        
        // Handle preflight requests
        if ($request->getMethod() === 'options') {
            http_response_code(204);
            exit();
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
