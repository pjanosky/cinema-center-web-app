import axios from "axios";
import { Movie, User } from "../types";

export async function searchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get(`/search/movies?query=${query}`);
  return response.data;
}
export async function searchUsers(query: string): Promise<User[]> {
  const response = await axios.get(`/search/users?query=${query}`);
  return response.data;
}
