import axios from "axios";
import { MovieDetails, Review, User } from "../types";

export async function getMoveDetails(id: string): Promise<MovieDetails> {
  const response = await axios.get(`/movie/${id}`);
  return response.data;
}

export async function getReviewsForMovie(id: string): Promise<Review[]> {
  const response = await axios.get(`/movie/${id}/reviews`);
  return response.data;
}

export async function addReview(review: Review): Promise<Review> {
  const response = await axios.post("/reviews", review);
  return response.data;
}

export async function updateReview(review: Review): Promise<Review> {
  const response = await axios.put(`/reviews/${review._id}`, review);
  return response.data;
}

export async function deleteReview(reviewId: string): Promise<Review> {
  const response = await axios.delete(`/reviews/${reviewId}`);
  return response.data;
}

export async function likeReview(
  reviewId: string,
  userId: string
): Promise<Review> {
  const response = await axios.post(`/reviews/${reviewId}/likes/${userId}`);
  return response.data;
}

export async function unlikeReview(
  reviewId: string,
  userId: string
): Promise<Review> {
  const response = await axios.delete(`/reviews/${reviewId}/likes/${userId}`);
  return response.data;
}

export async function getLikesForReview(reviewId: string): Promise<User[]> {
  const response = await axios.get(`/reviews/${reviewId}/likes`);
  return response.data;
}
