import { useCallback, useEffect, useState } from "react";
import { useUser } from "../Account/hooks";
import { MovieDetails, Review, User } from "../types";
import RatingStars from "./ratingStars";
import * as userClient from "../Profile/client";
import * as movieClient from "../Details/client";
import { Link } from "react-router-dom";
import "./index.css";
import { IfMatchingUser, IfUser } from "../Account/components";
import LikesModalButton from "./likesModalButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const currentUser = useUser();
  const [user, setUser] = useState<User | undefined>();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | undefined>();

  const liked = currentUser && review.likes.includes(currentUser._id);
  const toggleLike = async () => {
    try {
      const updatedReview = liked
        ? await movieClient.unlikeReview(review._id, currentUser!._id)
        : await movieClient.likeReview(review._id, currentUser!._id);
      setReview(updatedReview);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      const user = await userClient.getUser(review.userId);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }, [review.userId]);
  const fetchMovieDetails = useCallback(async () => {
    try {
      const movieDetails = await movieClient.getMoveDetails(review.movieId);
      setMovieDetails(movieDetails);
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
              {movieDetails?.title}
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
      <div className="my-1">{review.content}</div>
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
