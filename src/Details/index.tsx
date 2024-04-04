import { useParams } from "react-router";
import * as client from "./client";
import { useCallback, useEffect, useState } from "react";
import { MovieDetails } from "../types";
import RatingStars from "./ratingStars";
import Poster from "../Search/poster";
import MoviesList from "../Search/moviesList";
import { useUser } from "../Account/hooks";

export default function Details() {
  const { id } = useParams();
  const currentUser = useUser();
  const [details, setDetails] = useState<MovieDetails | undefined>();
  const fetchDetails = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const details = await client.getMoveDetails(id);
      setDetails(details);
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-100 h-auto mb-4">
        <Poster path={`/w1280/${details.backdrop_path}`} />
      </div>
      <div className="mb-4">
        <h1>{details.title}</h1>

        <div style={{ columnGap: "25px" }} className="d-flex flex-wrap">
          <RatingStars
            voteAverage={details.vote_average}
            voteCount={details.vote_count}
          />
          <div>
            {details.genres &&
              details.genres.map((genre) => genre.name).join(" | ")}
          </div>
          <div>
            {details.release_date &&
              `Released ${new Date(details.release_date).getFullYear()}`}
          </div>
          <div>{details.runtime && details.runtime} Minutes</div>
        </div>
        <div className="my-1">{details.overview && details.overview}</div>
      </div>
      {currentUser && currentUser.role === "editor" && (
        <div>
          <h2>Write a Review</h2>
        </div>
      )}
      {currentUser && currentUser.role === "user" && (
        <div className="mb-4">
          <h2>Add to List</h2>
          <ul>
            <li>Create new list...</li>
            <li>List 1</li>
            <li>List 2</li>
            <li>List 3</li>
          </ul>
        </div>
      )}
      {details.reviews.length > 0 && (
        <div className="mb-4">
          <h2>Reviews</h2>
        </div>
      )}
      <div className="mb-4">
        <h2>Similar Movies</h2>
        <MoviesList movies={details.similar} />
      </div>
    </div>
  );
}
