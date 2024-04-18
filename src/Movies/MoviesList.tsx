import { Link } from "react-router-dom";
import { MovieResult } from "../API/Movies/types";
import MovieItem from "./MovieItem";

export default function MoviesList({ movies }: { movies: MovieResult[] }) {
  return (
    <div className="cc-movies-list">
      <ul className="list-group">
        {movies.map((movie) => (
          <li key={movie.id} className="list-group-item">
            <Link
              to={`/details/${movie.id}`}
              style={{ textDecoration: "none" }}
            >
              <MovieItem movie={movie} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
