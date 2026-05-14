<?php

namespace App\Controllers;

use App\Models\WatchlistModel;
use CodeIgniter\RESTful\ResourceController;

class Watchlists extends ResourceController
{
    public function add($user_id, $movie_id)
    {
        $model = model(WatchlistModel::class);

        // Check if the user already has the movie in their watchlist
        $review = $model->where('user_id', $user_id)->where('movie_id', $movie_id)->find();
        if ($review != null)
            return $this->respondNoContent();

        // Save to the database
        $model->insert([
            'user_id' => $user_id,
            'movie_id' => $movie_id,
        ]);

        // The movie has been added to the watchlist, return success (201)
        return $this->respondCreated([
            "message" => "Added to watchlist",
        ]);
    }

    public function show($id = null)
    {
        $model = model(WatchlistModel::class);

        // Get movies in the user's watchlist
        $data["movies"] = $model->getMovies($id);
        return $this->respond($data);
    }

    public function remove($user_id, $movie_id)
    {
        $model = model(WatchlistModel::class);

        // Check if the user has the movie in their watchlist
        $review = $model->where('user_id', $user_id)->where('movie_id', $movie_id)->find();
        if ($review == null)
            return $this->failNotFound("Movie not found");

        // Remove the movie from the user's watchlist
        if ($model->where('user_id', $user_id)->where('movie_id', $movie_id)->delete())
            return $this->respondDeleted([
                "message" => "Removed from watchlist"
            ]);

        return $this->failServerError("Failed to delete");
    }
}
