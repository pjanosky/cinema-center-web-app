import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { MovieResult } from "../API/Movies/types";
import MoviePoster from "./MoviePoster";

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
              <div className="d-flex gap-3 align-items-top">
                <div
                  className="flex-shrink-0"
                  style={{ width: "92px", height: "138px" }}
                >
                  <MoviePoster size="w92" path={movie.poster_path} />
                </div>
                <div className="flex-grow-1 flex-shrink-1">
                  <span style={{ color: "black" }}>
                    <h5>{movie.title}</h5>
                    {movie.release_date &&
                      new Date(movie.release_date).getFullYear()}
                    <br />
                    <div
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        WebkitLineClamp: "2",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        lineClamp: "2",
                      }}
                    >
                      {movie.overview && movie.overview}
                    </div>
                  </span>
                </div>

                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ color: "lightgray" }}
                  className="align-self-center flex-shrink-0"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
