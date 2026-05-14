<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/api/test', 'Api::test');

// Session Routes
$routes->post('/auth/login', 'Auth::login');
$routes->post('/auth/logout', 'Auth::logout');
$routes->get('/auth/timeout', 'Auth::timeout');
$routes->get('/auth', 'Auth::me');

// User Routes
$routes->post('/users', 'Users::create');
$routes->get('/users/(:segment)', 'Users::showUser/$1');
$routes->put('/users/name/(:segment)', 'Users::update/$1/1');
$routes->put('/users/password/(:segment)', 'Users::update/$1/2');
$routes->delete('/users/(:segment)', 'Users::delete/$1');

// Review Routes
$routes->post('/reviews', 'Reviews::create');
$routes->get('/reviews', 'Reviews::index');
$routes->get('/reviews/users/(:segment)', 'Reviews::showReview/$1/2');
$routes->get('/reviews/movie/(:segment)', 'Reviews::showReview/$1/3');
$routes->get('/reviews/(:segment)', 'Reviews::showReview/$1/1');
$routes->delete('/reviews/(:segment)', 'Reviews::delete/$1');
$routes->put('/reviews/(:segment)', 'Reviews::update/$1');

// Watchlist Routes
$routes->post('/watchlist/(:segment)/(:segment)', 'Watchlists::add/$1/$2');
$routes->delete('/watchlist/(:segment)/(:segment)', 'Watchlists::remove/$1/$2');
$routes->get('/watchlist/(:segment)', 'Watchlists::show/$1');

$routes->options('(:any)', static function () {
    return response()->setStatusCode(200);
});
