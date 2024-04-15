import axios from "axios";
import { List, NewList, UpdateList, ListEntry } from "./types";

async function getListById(listId: string): Promise<List> {
  const response = await axios.get(`/lists/${listId}`);
  return response.data;
}
async function getListsByUser(userId: string): Promise<List[]> {
  const response = await axios.get(`/lists?userId=${userId}`);
  return response.data;
}
async function getListsByMovie(movieId: string): Promise<List[]> {
  const response = await axios.get(`/lists?movieId=${movieId}`);
  return response.data;
}
async function getRecentLists(limit: number = 5): Promise<List[]> {
  const response = await axios.get(`/lists?sort=date&limit=${limit}`);
  return response.data;
}
async function createList(info: NewList): Promise<List> {
  const response = await axios.post("/lists", info);
  return response.data;
}
async function updateList(list: UpdateList): Promise<List> {
  const response = await axios.put(`/lists/${list._id}`, list);
  return response.data;
}
async function deleteList(listId: string): Promise<void> {
  await axios.delete(`/lists/${listId}`);
}
async function addEntryToList(listId: string, entry: ListEntry): Promise<List> {
  const response = await axios.post(`/lists/${listId}/entries`, entry);
  return response.data;
}
async function updateEntryInList(
  listId: string,
  entry: ListEntry
): Promise<ListEntry> {
  const response = await axios.put(
    `/lists/${listId}/entries/${entry.movieId}`,
    entry
  );
  return response.data;
}
async function removeEntryFromList(
  listId: string,
  movieId: string
): Promise<void> {
  await axios.delete(`/lists/${listId}/entries/${movieId}`);
}

const listsClient = {
  getListById,
  getListsByUser,
  getListsByMovie,
  getRecentLists,
  createList,
  updateList,
  deleteList,
  addEntryToList,
  updateEntryInList,
  removeEntryFromList,
};
export default listsClient;
