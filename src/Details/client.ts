import axios from "axios";
import { MovieDetails } from "../types";

export async function getMoveDetails(id: string): Promise<MovieDetails> {
  const response = await axios.get(`/movie/${id}`);
  return response.data;
}
