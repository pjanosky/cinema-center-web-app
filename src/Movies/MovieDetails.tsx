import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import ReviewsList from "./ReviewsList";
import { useRefetchOnUnauthorized, useCurrentUser } from "../Account/hooks";
import { isAxiosError } from "axios";
import { IfEditor, IfNotEditor, IfUser } from "../Account/Components";
import ListList from "../List/ListList";
import moviesClient from "../API/Movies/client";
import reviewsClient from "../API/Reviews/client";
import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import { Movie } from "../API/Movies/types";
import { Review } from "../API/Reviews/types";
import RatingStars from "./RatingStars";
import ReviewEditor from "./ReviewEditor";
import MoviePoster from "./MoviePoster";
import MoviesList from "./MoviesList";

export default function MovieDetails() {
  const { id: movieId } = useParams();
  const currentUser = useCurrentUser();
  const [details, setMovie] = useState<Movie | undefined>();
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
  const [userLists, setUserLists] = useState<List[]>([]);
  const [movieLists, setMovieLists] = useState<List[]>([]);
  const [description, setDescription] = useState("");
  const [selectedListId, setSelectedListId] = useState("");
  const [error, setError] = useState("");
  const refetchOnUnauthorized = useRefetchOnUnauthorized();

  const hasUserReview =
    reviews.find((review) => review.userId === currentUser?._id) !== undefined;
  const ratingAverage =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0.0) /
        reviews.length
      : -1;
  const unaddedUserLists = userLists.filter(
    (userList) =>
      !movieLists.find((movieList) => movieList._id === userList._id)
  );

  const fetchDetails = useCallback(async () => {
    if (!movieId) {
      return;
    }
    try {
      const movie = await moviesClient.getMovieById(movieId);
      setMovie(movie);
    } catch (error) {
      console.log(error);
    }
  }, [movieId]);
  const fetchReviews = useCallback(async () => {
    if (!movieId) {
      return;
    }
    try {
      const reviews = await reviewsClient.getReviewsByMovie(movieId);
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
      const newReview = await reviewsClient.createReview(userReview);
      setReviews((reviews) => [...reviews, newReview]);
      setUserReview(newReview);
    } catch (error) {
      refetchOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data || "Error adding review");
      }
    }
  };
  const updateReview = async () => {
    setError("");
    try {
      const updatedReview = await reviewsClient.updateReview(userReview);
      setReviews((reviews) =>
        reviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
      setUserReview(updatedReview);
    } catch (error) {
      refetchOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data || "Error updating review");
      }
    }
  };
  const deleteReview = async () => {
    setError("");
    try {
      await reviewsClient.deleteReview(userReview._id);
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
      refetchOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data || "Error deleting review");
      }
    }
  };
  const fetchUserLists = useCallback(async () => {
    if (!currentUser || currentUser.role !== "editor") return;
    try {
      const lists = await listsClient.getListsByUser(currentUser._id);
      setUserLists(lists);
      const unaddedUserLists = lists.filter(
        (list) => !list.entries.find((entry) => entry.movieId === movieId)
      );
      setSelectedListId(unaddedUserLists[0]?._id || "");
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, movieId]);
  const fetchMovieLists = useCallback(async () => {
    if (!movieId) return;
    try {
      const lists = await listsClient.getListsByMovie(movieId);
      setMovieLists(lists);
    } catch (error) {
      console.log(error);
    }
  }, [movieId]);
  const addToList = async () => {
    if (!selectedListId || !movieId) return;
    setError("");
    try {
      const updatedList = await listsClient.addEntryToList(selectedListId, {
        movieId: movieId,
        description: description,
      });
      setMovieLists((lists) => [...lists, updatedList]);
      setDescription("");
      setSelectedListId(unaddedUserLists[0]?._id);
    } catch (error) {
      refetchOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response?.data || "Error adding to list");
      }
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchReviews();
    fetchUserLists();
    fetchMovieLists();
  }, [fetchDetails, fetchUserLists, fetchReviews, fetchMovieLists]);

  return (
    <div>
      <div className="w-100 mb-4">
        {details?.backdrop_path && (
          <MoviePoster
            size="w1280"
            path={details.backdrop_path}
            showPlaceholder={false}
          />
        )}
      </div>
      <div className="mb-4">
        <h1>{details?.title || ""}</h1>

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
            {details?.genres &&
              details.genres.map((genre) => genre.name).join(" | ")}
          </div>
          <div>
            {details?.release_date &&
              `Released ${new Date(details.release_date).getFullYear()}`}
          </div>
          <div>{details?.runtime && details.runtime} Minutes</div>
        </div>
        <div className="my-1">{details?.overview && details.overview}</div>
      </div>
      {details && details.cast.length > 0 && (
        <div className="mb-4 w-100">
          <h2>Cast</h2>
          <div className="d-flex flex-wrap gap-3">
            {details.cast.map((member) => (
              <div
                key={member.id}
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
                    <MoviePoster size="w185" path={member.profile_path} />
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
          <h2>My Review</h2>
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
      <IfEditor>
        <div className="mb-4" style={{ maxWidth: "800px" }}>
          <h2>Add to List</h2>
          <div className="mb-3">
            <select
              className="form-select"
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              disabled={unaddedUserLists.length === 0}
            >
              {unaddedUserLists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.title}
                </option>
              ))}
              {unaddedUserLists.length === 0 ? (
                <option>No lists available</option>
              ) : (
                <></>
              )}
            </select>
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              value={description}
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              disabled={unaddedUserLists.length === 0}
            ></textarea>
          </div>
          <div className="mb-3">
            <button
              className="btn btn-primary"
              onClick={addToList}
              disabled={unaddedUserLists.length === 0}
            >
              Add
            </button>
          </div>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
        </div>
        {movieLists.length > 0 && (
          <div className="mb-3">
            <h2>Lists with this movie</h2>
            <ListList
              lists={movieLists}
              setLists={setMovieLists}
              movieId={movieId}
            ></ListList>
          </div>
        )}
      </IfEditor>
      {reviews.length > 0 && (
        <div className="mb-4">
          <h2>Reviews</h2>
          <ReviewsList
            reviews={reviews}
            setReviews={setReviews}
            showReview={(review: Review) =>
              !currentUser || review.userId !== currentUser._id
            }
          />
        </div>
      )}
      <IfNotEditor>
        {movieLists.length > 0 && (
          <div className="mb-3">
            <h2>Lists with this movie</h2>
            <ListList
              lists={movieLists}
              setLists={setMovieLists}
              movieId={movieId}
            ></ListList>
          </div>
        )}
      </IfNotEditor>

      {details && details.similar.length > 0 && (
        <div className="mb-4">
          <h2>Similar Movies</h2>
          <MoviesList movies={details.similar} />
        </div>
      )}
    </div>
  );
}
