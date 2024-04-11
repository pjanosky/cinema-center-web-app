import axios from "axios";
import { List, ListEntry, Review, User } from "../types";

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

export async function getListsForUser(userId: string): Promise<List[]> {
  const response = await axios.get(`/user/${userId}/lists`);
  return response.data;
}

export async function addList(list: List): Promise<List> {
  const response = await axios.post(`/lists`, list);
  return response.data;
}

export async function updateList(list: List): Promise<List> {
  const response = await axios.put(`/list/${list._id}`, list);
  return response.data;
}

export async function deleteList(listId: string) {
  const response = await axios.delete(`/list/${listId}`);
  return response.data;
}

export async function addMovieToList(
  listId: string,
  movieInfo: ListEntry
): Promise<ListEntry> {
  const response = await axios.post(`/list/${listId}/movie/`, movieInfo);
  return response.data;
}

export async function updateMovieInList(
  listId: string,
  { movieId, description }: ListEntry
): Promise<ListEntry> {
  const response = await axios.put(`/list/${listId}/movie/${movieId}`, {
    description,
  });
  return response.data;
}

export async function deleteMovieFromList(listId: string, movieId: string) {
  const response = await axios.delete(`/list/${listId}/movie/${movieId}`);
  return response.data;
}
