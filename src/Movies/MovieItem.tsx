import { faVideo, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MoviePoster from "./MoviePoster";
import { MovieResult } from "../API/Movies/types";

export default function MovieItem({
  movie,
}: {
  movie: MovieResult | undefined;
}) {
  return (
    <div className="d-flex align-items-center my-2">
      <div className="d-flex gap-3 align-items-top flex-wrap flex-grow-1 flex-shrink-1">
        <div
          className="flex-shrink-0"
          style={{ width: "92px", height: "138px" }}
        >
          <MoviePoster size="w92" path={movie?.poster_path}>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center cc-bg-secondary-2">
              <FontAwesomeIcon
                icon={faVideo}
                className="cc-secondary-1"
                style={{ fontSize: "2rem" }}
              />
            </div>
          </MoviePoster>
        </div>
        <div
          className="flex-grow-1 flex-shrink-1"
          style={{ flexBasis: "200px" }}
        >
          <div className="fw-bold">{movie?.title && movie.title}</div>
          <div className="cc-secondary-1">
            {movie?.release_date && new Date(movie?.release_date).getFullYear()}
          </div>
          <div
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              WebkitLineClamp: "3",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              lineClamp: "3",
            }}
          >
            {movie?.overview && movie.overview}
          </div>
        </div>
      </div>

      <FontAwesomeIcon
        icon={faChevronRight}
        className="align-self-center flex-shrink-0 flex-grow-0 cc-secondary-1"
      />
    </div>
  );
}
