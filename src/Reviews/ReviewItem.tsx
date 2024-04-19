import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import moviesClient from "../API/Movies/client";
import { Movie } from "../API/Movies/types";
import reviewsClient from "../API/Reviews/client";
import { Review } from "../API/Reviews/types";
import usersClient from "../API/Users/client";
import { User } from "../API/Users/types";
import { IfUser, IfMatchingUser } from "../Users/Components";
import { useCurrentUser } from "../Users/Hooks";
import LikesModalButton from "../Movies/LikesModalButton";
import RatingStars from "../Movies/RatingStars";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function ReviewItem({
  review,
  deleteReview,
  editReview,
  setReview,
}: {
  review: Review;
  deleteReview: (review: Review) => void;
  editReview: (review: Review) => void;
  setReview: (review: Review) => void;
}) {
  const currentUser = useCurrentUser();
  const [user, setUser] = useState<User | undefined>();
  const [movie, setMovie] = useState<Movie | undefined>();

  const liked = currentUser && review.likes.includes(currentUser._id);

  const toggleLike = async () => {
    try {
      const updatedReview = liked
        ? await reviewsClient.unlikeReview(review._id, currentUser!._id)
        : await reviewsClient.likeReview(review._id, currentUser!._id);
      setReview(updatedReview);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUser = useCallback(async () => {
    try {
      const user = await usersClient.getUserById(review.userId);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }, [review.userId]);
  const fetchMovieDetails = useCallback(async () => {
    try {
      const movie = await moviesClient.getMovieById(review.movieId);
      setMovie(movie);
    } catch (error) {
      console.log(error);
    }
  }, [review.movieId]);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
  });
  const date = dateFormatter.format(new Date(review.date));

  useEffect(() => {
    fetchUser();
    fetchMovieDetails();
  }, [fetchUser, fetchMovieDetails]);

  return (
    <div className="cc-review-item">
      <div className="d-flex justify-content-sm-between flex-column flex-sm-row">
        <div>
          <div className="fw-bold">
            <Link to={`/details/${review.movieId}`} className="cc-link fw-bold">
              {movie?.title}
            </Link>
            <span> - {review.title}</span>
          </div>
          <RatingStars stars={review.rating} />
        </div>
        <div style={{ minWidth: "100px" }}>
          <Link
            to={`/profile/${user?._id}`}
            className="text-start text-sm-end cc-link"
          >
            <div style={{ color: "var(--secondary-1)" }}>{date}</div>
            <div style={{ color: "var(--secondary-1)" }}>{user?.name}</div>
          </Link>
        </div>
      </div>
      <div className="my-1" style={{ whiteSpace: "pre-wrap" }}>
        {review.content}
      </div>
      <div className="d-flex gap-2 align-items-center">
        <IfUser>
          <button
            onClick={toggleLike}
            style={{
              fontSize: "1.5em",
              color: "var(--accent-color)",
              backgroundColor: "transparent",
              border: "none",
            }}
            className={"btn btn-tertiary px-0 py-0 cc-link"}
          >
            {liked ? (
              <FontAwesomeIcon icon={faHeartSolid} />
            ) : (
              <FontAwesomeIcon icon={faHeartRegular} />
            )}
          </button>
        </IfUser>
        <LikesModalButton review={review}>
          <div className="cc-link" style={{ color: "var(--secondary-1)" }}>
            {review.likes.length} Like{review.likes.length === 1 ? "" : "s"}
          </div>
        </LikesModalButton>
      </div>
      <IfMatchingUser userId={review.userId}>
        <div className="d-flex gap-2 mt-2 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={() => editReview(review)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => deleteReview(review)}
          >
            Delete
          </button>
        </div>
      </IfMatchingUser>
    </div>
  );
}
