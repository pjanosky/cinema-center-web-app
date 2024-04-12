import axios from "axios";
import { NewUser, UpdateUser, User } from "./types";

async function getCurrentUser(): Promise<User> {
  const response = await axios.get("/users/current");
  return response.data;
}
async function getUserById(userId: string): Promise<User> {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
}
async function searchUsers(query: string): Promise<User[]> {
  const response = await axios.get(`/users?query=${query}`);
  return response.data;
}
async function getUsersWhoLikedReview(reviewId: string): Promise<User[]> {
  const response = await axios.get(`/users?likedReview=${reviewId}`);
  return response.data;
}
async function createUser(user: NewUser): Promise<User> {
  const response = await axios.post("/users", user);
  return response.data;
}
async function updateUserInformation(user: UpdateUser): Promise<User> {
  const response = await axios.put(`/users/${user._id}/information`, user);
  return response.data;
}
async function updateUserPassword(
  userId: string,
  passwords: { oldPassword: string; newPassword: string }
): Promise<void> {
  await axios.put(`/users/${userId}/password`, passwords);
}
async function deleteUser(userId: string): Promise<void> {
  await axios.delete(`/users/${userId}`);
}
async function getFollowing(userId: string): Promise<User[]> {
  const response = await axios.get(`/users/${userId}/following`);
  return response.data;
}
async function getFollowers(userId: string): Promise<User[]> {
  const response = await axios.get(`/users/${userId}/followers`);
  return response.data;
}
async function followUser(
  userId: string,
  followingId: string
): Promise<string> {
  const response = await axios.post(`/users/${userId}/following/`, {
    followingId,
  });
  return response.data;
}
async function unfollowUser(
  userId: string,
  followingId: string
): Promise<void> {
  await axios.delete(`/users/${userId}/following/${followingId}`);
}
async function login(username: string, password: string): Promise<User> {
  const response = await axios.post("/account/login", { username, password });
  return response.data;
}
async function logout(): Promise<void> {
  await axios.post("/account/logout");
}

const usersClient = {
  getCurrentUser,
  getUserById,
  searchUsers,
  getUsersWhoLikedReview,
  createUser,
  updateUserInformation,
  updateUserPassword,
  deleteUser,
  getFollowing,
  getFollowers,
  followUser,
  unfollowUser,
  login,
  logout,
};
export default usersClient;
