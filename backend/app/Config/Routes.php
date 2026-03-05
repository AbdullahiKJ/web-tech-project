<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/api/test', 'Api::test');
$routes->post('/users', 'Users::create');
$routes->options('(:any)', static function () {
    return response()->setStatusCode(200);
});
