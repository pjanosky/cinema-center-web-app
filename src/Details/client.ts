import axios from "axios";
import { List, ListEntry, MovieDetails, Review, User } from "../types";

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

export async function getListsForUser(userId: string): Promise<List[]> {
  const response = await axios.get(`/user/${userId}/lists`);
  return response.data;
}

export async function getListsForMovie(movieId: string): Promise<List[]> {
  const response = await axios.get(`/movie/${movieId}/lists`);
  return response.data;
}

export async function addMovieToList(
  listId: string,
  { movieId, description }: ListEntry
): Promise<List> {
  console.log("Adding movie to list", listId, movieId, description);
  const response = await axios.post(`/list/${listId}/${movieId}`, {
    description,
  });
  return response.data;
}

export async function deleteMovieFromList(listId: string, movieId: string) {
  const response = await axios.delete(`/list/${listId}/${movieId}`);
  return response.data;
}
