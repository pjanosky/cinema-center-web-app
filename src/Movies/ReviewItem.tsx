import { useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "../Account/hooks";
import { Link } from "react-router-dom";
import "./index.css";
import { IfMatchingUser, IfUser } from "../Account/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import moviesClient from "../API/Movies/client";
import { Review } from "../API/Reviews/types";
import { User } from "../API/Users/types";
import { Movie } from "../API/Movies/types";
import reviewsClient from "../API/Reviews/client";
import usersClient from "../API/Users/client";
import RatingStars from "./RatingStars";
import LikesModalButton from "./LikesModalButton";

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
      <div className="d-flex justify-content-between">
        <div>
          <div className="fw-bold">
            <Link to={`/details/${review.movieId}`} className="cc-link">
              {movie?.title}
            </Link>
            {" - "}
            <span>{review.title}</span>
          </div>
          <RatingStars stars={review.rating} />
        </div>
        <Link to={`/profile/${user?._id}`} className="text-end cc-link">
          <div>{date}</div>
          <div>{user?.name}</div>
        </Link>
      </div>
      <div className="my-1" style={{ whiteSpace: "pre-wrap" }}>
        {review.content}
      </div>
      <div className="d-flex gap-2 align-items-center">
        <IfUser>
          <button
            onClick={toggleLike}
            style={{ fontSize: "1.5em", color: "var(--accent-color)" }}
            className={"btn btn-tertiary px-0 py-0 cc-like-btn"}
          >
            {liked ? (
              <FontAwesomeIcon icon={faHeartSolid} />
            ) : (
              <FontAwesomeIcon icon={faHeartRegular} />
            )}
          </button>
        </IfUser>
        <LikesModalButton review={review}>
          <div className="btn btn-tertiary p-0 m-0 cc-like-btn">
            {review.likes.length} Like{review.likes.length === 1 ? "" : "s"}
          </div>
        </LikesModalButton>
      </div>
      <IfMatchingUser userId={review.userId}>
        <div className="d-flex gap-2 mt-2">
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
