import { useParams } from "react-router";
import * as client from "./client";
import { useCallback, useEffect, useState } from "react";
import { MovieDetails, Review } from "../types";
import Poster from "../Search/poster";
import MoviesList from "../Search/moviesList";
import ReviewEditor from "./reviewEditor";
import RatingStars from "./ratingStars";
import ReviewsList from "./reviewsList";
import { useRefreshOnUnauthorized, useUser } from "../Account/hooks";
import { isAxiosError } from "axios";
import { IfUser } from "../Account/components";

export default function Details() {
  const { id: movieId } = useParams();
  const currentUser = useUser();
  const [details, setDetails] = useState<MovieDetails | undefined>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review>({
    _id: "",
    title: "",
    content: "",
    rating: 5,
    movieId: movieId || "",
    userId: "",
    date: "",
    likes: [],
  });
  const [error, setError] = useState("");
  const refreshOnUnauthorized = useRefreshOnUnauthorized();

  const hasUserReview =
    reviews.find((review) => review.userId === currentUser?._id) !== undefined;
  const ratingAverage =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : -1;

  const fetchDetails = useCallback(async () => {
    if (!movieId) {
      return;
    }
    try {
      const details = await client.getMoveDetails(movieId);
      setDetails(details);
    } catch (error) {
      console.log(error);
    }
  }, [movieId]);
  const fetchReviews = useCallback(async () => {
    if (!movieId) {
      return;
    }
    try {
      const reviews = await client.getReviewsForMovie(movieId);
      setReviews(reviews);
      const userReview = reviews.find(
        (review) => review.userId === currentUser?._id
      );
      if (userReview) {
        setUserReview(userReview);
      }
    } catch (error) {
      console.log(error);
    }
  }, [movieId, currentUser?._id]);
  const addReview = async () => {
    setError("");
    try {
      const newReview = await client.addReview(userReview);
      setReviews((reviews) => [...reviews, newReview]);
      setUserReview(newReview);
    } catch (error) {
      refreshOnUnauthorized(error);
      console.log(
        error,
        isAxiosError(error),
        isAxiosError(error) && error.response?.status
      );
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data || "Error adding review");
      }
    }
  };
  const updateReview = async () => {
    setError("");
    try {
      const updatedReview = await client.updateReview(userReview);
      setReviews((reviews) =>
        reviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
      setUserReview(updatedReview);
    } catch (error) {
      refreshOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data || "Error updating review");
      }
    }
  };
  const deleteReview = async () => {
    setError("");
    try {
      await client.deleteReview(userReview._id);
      setReviews((reviews) =>
        reviews.filter((review) => review._id !== userReview._id)
      );
      setUserReview({
        _id: "",
        title: "",
        content: "",
        rating: 5,
        movieId: movieId || "",
        userId: "",
        date: "",
        likes: [],
      });
    } catch (error) {
      refreshOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data || "Error deleting review");
      }
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchReviews();
  }, [fetchDetails, fetchReviews]);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-100 mb-4">
        <Poster
          size="w1280"
          path={details.backdrop_path}
          showPlaceholder={false}
        />
      </div>
      <div className="mb-4">
        <h1>{details.title}</h1>

        <div style={{ columnGap: "25px" }} className="d-flex flex-wrap">
          {reviews.length > 0 && (
            <div className="d-flex align-items-center">
              <RatingStars stars={ratingAverage} />
              <span className="ms-1">
                ({reviews.length} Rating{reviews.length === 1 ? "" : "s"})
              </span>
            </div>
          )}
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
      {details.cast.length > 0 && (
        <div className="mb-4 w-100">
          <h2>Cast</h2>
          <div className="d-flex flex-wrap gap-3">
            {details.cast.map((member) => (
              <div
                style={{
                  width: "100px",
                  textAlign: "center",
                  wordBreak: "break-word",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{ width: "100px", height: "150px", margin: "auto" }}
                  >
                    <Poster size="w185" path={member.profile_path}></Poster>
                  </div>
                </div>
                {member.name}
              </div>
            ))}
          </div>
        </div>
      )}
      <IfUser>
        <div className="mb-4">
          <h2>Write your review</h2>
          <ReviewEditor review={userReview} setReview={setUserReview} />
          <div className="mb-3 d-flex gap-2">
            {hasUserReview ? (
              <>
                <button onClick={updateReview} className="btn btn-primary">
                  Update Review
                </button>
                <button onClick={deleteReview} className="btn btn-danger">
                  Delete Review
                </button>
              </>
            ) : (
              <button onClick={addReview} className="btn btn-primary">
                Add Review
              </button>
            )}
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </IfUser>
      {reviews.find((review) => review.userId !== currentUser?._id) && (
        <div className="mb-4">
          <h2>Other Reviews</h2>
          <ReviewsList
            reviews={reviews}
            setReviews={setReviews}
            showReview={(review: Review) =>
              !currentUser || review.userId !== currentUser._id
            }
          />
        </div>
      )}
      <div className="mb-4">
        <h2>Add to List</h2>
        <ul>
          <li>Create new list...</li>
          <li>List 1</li>
          <li>List 2</li>
          <li>List 3</li>
        </ul>
      </div>
      <div className="mb-4">
        <h2>Similar Movies</h2>
        <MoviesList movies={details.similar} />
      </div>
    </div>
  );
}
