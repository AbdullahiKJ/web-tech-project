<?php

namespace App\Models;

use CodeIgniter\Model;

class WatchlistModel extends Model
{
    protected $table = 'watchlist';
    protected $useAutoIncrement = false;
    protected $allowedFields = ['user_id', 'movie_id'];

    public function getMovies($id)
    {
        // Get the IDs of all the movies in the user's watchlist
        $rows = $this->select('movie_id')
            ->where('user_id', $id)
            ->findAll();

        $movieIds = array_column($rows, 'movie_id');
        return $movieIds;
    }
}
