import axios from "axios";
import { Review, User } from "../types";

export async function getUser(userId: string): Promise<User> {
  const response = await axios.get(`/user/${userId}`);
  return response.data;
}

export async function getFollowing(userId: string): Promise<User[]> {
  const response = await axios.get(`/user/${userId}/following`);
  return response.data;
}

export async function getFollowers(userId: string): Promise<User[]> {
  const response = await axios.get(`/user/${userId}/followers`);
  return response.data;
}

export async function addFollower(currentUserId: string, followingId: string) {
  await axios.post(`/user/${currentUserId}/following/${followingId}`);
}

export async function removeFollower(
  currentUserId: string,
  followingId: string
) {
  await axios.delete(`/user/${currentUserId}/following/${followingId}`);
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  const response = await axios.get(`/user/${userId}/reviews`);
  return response.data;
}

export async function getLikesForUser(userId: string): Promise<Review[]> {
  const response = await axios.get(`/user/${userId}/likes`);
  return response.data;
}
