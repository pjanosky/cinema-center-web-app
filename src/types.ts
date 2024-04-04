export type Role = "user" | "editor";

export type List = {};

export type Review = {};

export type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  following: string[];
};

export type Movie = {
  adult?: boolean;
  backdrop_path?: string | null;
  genre_ids?: string[];
  id: number;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  title: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
};

export type MovieDetails = {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget?: number;
  genres?: {
    id: number;
    name: string;
  }[];
  homepage?: string;
  id: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  production_companies?: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status?: string;
  tagline?: string;
  title: string;
  video?: false;
  vote_average?: number;
  vote_count?: number;
  similar: Movie[];
  lists: List[];
  reviews: Review[];
};
