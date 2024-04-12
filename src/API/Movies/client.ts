import axios from "axios";
import { MovieResult, Movie } from "./types";

async function searchMovies(query: string): Promise<MovieResult[]> {
  const response = await axios.get(`/movies?query=${query}`);
  return response.data;
}

async function getMovieById(movieId: string): Promise<Movie> {
  const response = await axios.get(`/movies/${movieId}`);
  return response.data;
}

const moviesClient = {
  searchMovies,
  getMovieById,
};
export default moviesClient;
