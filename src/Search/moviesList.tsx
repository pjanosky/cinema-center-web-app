import { Link } from "react-router-dom";
import { Movie } from "../types";
import "./index.css";
import Poster from "./poster";
import { FaChevronRight } from "react-icons/fa";

export default function MoviesList({ movies }: { movies: Movie[] }) {
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
                  <Poster path={`/w92${movie.poster_path}`} />
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
                <FaChevronRight
                  className="align-self-center flex-shrink-0"
                  style={{ color: "lightgray" }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
