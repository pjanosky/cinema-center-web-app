import axios from "axios";
import { NewReview, Review, UpdateReview } from "./types";

async function getReviewsByUser(userId: string): Promise<Review[]> {
  const response = await axios.get(`/reviews?userId=${userId}`);
  return response.data;
}
async function getReviewsLikedByUser(userId: string): Promise<Review[]> {
  const response = await axios.get(`/reviews?likedBy=${userId}`);
  return response.data;
}
async function getReviewsByMovie(movieId: string): Promise<Review[]> {
  const response = await axios.get(`/reviews?movieId=${movieId}`);
  return response.data;
}
async function createReview(review: NewReview): Promise<Review> {
  const response = await axios.post("/reviews", review);
  return response.data;
}
async function updateReview(review: UpdateReview): Promise<Review> {
  const response = await axios.put(`/reviews/${review._id}`, review);
  return response.data;
}
async function deleteReview(reviewId: string): Promise<void> {
  await axios.delete(`/reviews/${reviewId}`);
}
async function likeReview(reviewId: string, userId: string): Promise<Review> {
  const response = await axios.post(`/reviews/${reviewId}/likes`, { userId });
  return response.data;
}
async function unlikeReview(reviewId: string, userId: string): Promise<Review> {
  const response = await axios.delete(`/reviews/${reviewId}/likes/${userId}`);
  return response.data;
}

const reviewsClient = {
  getReviewsByUser,
  getReviewsLikedByUser,
  getReviewsByMovie,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
};
export default reviewsClient;
