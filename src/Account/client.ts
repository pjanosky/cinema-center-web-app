import axios from "axios";
import { Role, User } from "../types";

export async function register({
  name,
  email,
  username,
  password,
  role,
}: {
  name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
}): Promise<User> {
  let response = await axios.post("/account/register", {
    name,
    email,
    username,
    password,
    role,
  });
  return response.data;
}

export async function login(username: string, password: string): Promise<User> {
  let response = await axios.post("/account/login", {
    username,
    password,
  });
  return response.data;
}

export async function logout() {
  await axios.post("/account/logout");
}

export async function getProfile(): Promise<User> {
  let response = await axios.get("/account/profile");
  return await response.data;
}

export async function updateProfile({
  username,
  name,
  email,
}: {
  username: string;
  name: string;
  email: string;
}): Promise<User> {
  let response = await axios.put("/account/profile", {
    username,
    name,
    email,
  });
  return response.data;
}

export async function updatePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}): Promise<User> {
  let response = await axios.put("/account/password", {
    oldPassword,
    newPassword,
  });
  return response.data;
}

export async function deleteProfile() {
  await axios.delete("/account/profile");
}
