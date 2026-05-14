<?php

namespace App\Controllers;

use App\Models\ReviewModel;
use CodeIgniter\RESTful\ResourceController;

class Reviews extends ResourceController
{
    public function create()
    {
        helper('form');

        // Get the post data
        $data = $this->request->getJSON(true);

        $model = model(ReviewModel::class);

        // Generate a new review id and check if it exists
        $reviewId = '';
        $idExists = true;
        while ($idExists) {
            $reviewId = uniqid();
            $idExists = $model->find($reviewId) != null;
        }

        // Save to the database
        $model->insert([
            'id' => $reviewId,
            'movie_id' => $data['movie_id'],
            'rating'  => $data['rating'],
            'review_description'  => $data['review_description'],
            'user_id' => $data['user_id']
        ]);

        // The review has been created, return success (201)
        return $this->respondCreated([
            "message" => "Review created",
        ]);
    }

    public function index()
    {
        $model = model(ReviewModel::class);

        $data["reviews"] = $model->getReviews();
        return $this->respond($data);
    }

    public function showReview($slug, $type)
    {
        $model = model(ReviewModel::class);

        $data["reviews"] = $model->getReviews($slug, $type);
        return $this->respond($data);
    }

    public function delete($id = null)
    {
        $model = model(ReviewModel::class);

        // Check if the review exists
        $review = $model->find($id);
        if ($review == null)
            return $this->failNotFound("Review not found");

        // Delete the review
        if ($model->delete($id))
            return $this->respondDeleted([
                "message" => "Review Deleted"
            ]);

        return $this->failServerError("Failed to delete");
    }

    public function update($id = null)
    {
        helper('form');
        $model = model(ReviewModel::class);

        // Check if the review exists
        $review = $model->find($id);
        if ($review == null)
            return $this->failNotFound("Review not found");

        // Get the update data
        $data = $this->request->getJson(true);

        // Check if any of the inputs are null
        if ($data['rating'] == null || $data['review_description'] == null)
            return $this->respondNoContent();

        // Check if any changes have been made
        if ($data['rating'] == $review['rating'] && $data['review_description'] == $review['review_description'])
            return $this->respondNoContent();

        // Save changes to the database
        $model->update(
            $id,
            [
                'rating'  => $data['rating'],
                'review_description'  => $data['review_description'],
            ]
        );

        // The review has been updated, return success (200)
        return $this->respondUpdated([
            "message" => "Review updated",
        ]);
    }
}
