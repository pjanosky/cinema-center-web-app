import { Movie } from "../API/Movies/types";
import { Review } from "../API/Reviews/types";
import RatingStars from "./RatingStars";

export default function MovieDetailsHeader({
  details,
  reviews,
}: {
  details: Movie | undefined;
  reviews: Review[];
}) {
  const ratingAverage =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0.0) /
        reviews.length
      : -1;
  return (
    <div>
      <h1>{details?.title || ""}</h1>
      <div
        style={{ columnGap: "1.5rem", rowGap: "0.5rem" }}
        className="d-flex flex-wrap mb-4"
      >
        {reviews.length > 0 && (
          <div className="d-flex align-items-center">
            <RatingStars stars={ratingAverage} />
            <span className="ms-1">
              ({reviews.length} Rating{reviews.length === 1 ? "" : "s"})
            </span>
          </div>
        )}
        <div>
          {details?.genres &&
            details.genres.map((genre) => genre.name).join(" | ")}
        </div>
        {details?.release_date && (
          <div>
            {`Released ${new Date(details.release_date).getFullYear()}`}
          </div>
        )}
        {!!details?.runtime && <div>{details.runtime} Minutes</div>}
      </div>
      {details?.overview && <div className="my-1">{details.overview}</div>}
    </div>
  );
}
