<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/api/test', 'Api::test');

// User Routes
$routes->post('/users', 'Users::create');

// Review Routes
$routes->post('/reviews', 'Reviews::create');
$routes->get('/reviews', 'Reviews::index');
$routes->get('/reviews/(:segment)', 'Reviews::showReview/$1/1');
$routes->get('/users/(:segment)/reviews', 'Reviews::showReview/$1/2');
$routes->get('/media/(:segment)/reviews', 'Reviews::showReview/$1/3');
$routes->delete('/reviews/(:segment)', 'Reviews::delete/$1');
$routes->put('/reviews/(:segment)', 'Reviews::update/$1');

// Watchlist Routes
$routes->post('/watchlist/(:segment)/(:segment)', 'Watchlists::add/$1/$2');
$routes->delete('/watchlist/(:segment)/(:segment)', 'Watchlists::remove/$1/$2');
$routes->get('/watchlist/(:segment)', 'Watchlists::show/$1');

$routes->options('(:any)', static function () {
    return response()->setStatusCode(200);
});
