import axios from "axios";
import { List, ListEntry } from "../types";

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
  const response = await axios.put(`/list/${listId}/${movieId}`, {
    description,
  });
  return response.data;
}

export async function deleteMovieFromList(listId: string, movieId: string) {
  const response = await axios.delete(`/list/${listId}/${movieId}`);
  return response.data;
}

export async function getList(listId: string) {
  const response = await axios.get(`/list/${listId}`);
  return response.data;
}
