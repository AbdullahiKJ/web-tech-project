<?php

namespace App\Models;

use CodeIgniter\Model;

class ReviewModel extends Model
{
    protected $table = 'reviews';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $allowedFields = ['id', 'movie_id', 'rating', 'review_description', 'user_id'];

    public function getReviews($slug = false, $type = 1)
    {
        // Get all reviews
        if ($slug == false)
            return $this->findAll();
        else {
            // Get the review with the given id
            if ($type == 1) {
                return $this->where('id', $slug)->findAll();
            }
            // Get all reviews made by the given account
            else if ($type == 2) {
                return $this->where('user_id', $slug)->findAll();
            }
            // Get all reviews for the given movie/show
            else
                return $this->where('movie_id', $slug)->findAll();
        }
    }
}
