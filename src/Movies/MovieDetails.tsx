import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import ReviewList from "../Reviews/ReviewList";
import { useRefetchOnUnauthorized, useCurrentUser } from "../Users/Hooks";
import { isAxiosError } from "axios";
import { IfEditor, IfNotEditor, IfUser } from "../Users/Components";
import ListList from "../List/ListList";
import moviesClient from "../API/Movies/client";
import reviewsClient from "../API/Reviews/client";
import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import { Movie } from "../API/Movies/types";
import { Review } from "../API/Reviews/types";
import ReviewEditor from "../Reviews/ReviewEditor";
import MoviePoster from "./MoviePoster";
import MoviesList from "./MoviesList";
import MovieDetailsHeader from "./MovieDetailsHeader";
import MovieCast from "./MovieCast";

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
  }, [fetchDetails]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  useEffect(() => {
    fetchUserLists();
  }, [fetchUserLists]);
  useEffect(() => {
    fetchMovieLists();
  }, [fetchMovieLists]);

  const overlap = "150px";
  const padding = "100px";
  return (
    <div>
      <div className="mb-4">
        {details?.backdrop_path ? (
          <div style={{ margin: `-1.5rem -1.5rem -${overlap} -1.5rem` }}>
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              style={{
                maxHeight: "60vh",
                overflow: "hidden",
              }}
            >
              <MoviePoster size="w1280" path={details?.backdrop_path} />
            </div>
            <div
              className="position-relative pb-3"
              style={{
                top: `-${overlap}`,
                color: "white",
                background: `linear-gradient(transparent, var(--foreground-1) ${overlap}, var(--foreground-1)`,
                paddingTop: padding,
              }}
            >
              <div style={{ margin: "0 1.5rem 0 1.5rem" }}>
                {details && (
                  <MovieDetailsHeader details={details} reviews={reviews} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <MovieDetailsHeader details={details} reviews={reviews} />
        )}
      </div>
      {details && details.cast.length > 0 && (
        <div className="mb-4 w-100">
          <h2>Cast</h2>
          <MovieCast details={details} />
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
            <label className="w-100">
              List
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
            </label>
          </div>
          <div className="mb-3">
            <label className="w-100">
              Description
              <textarea
                className="form-control"
                value={description}
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this movie to watchers"
                disabled={unaddedUserLists.length === 0}
              ></textarea>
            </label>
          </div>
          <div className="mb-3">
            <button
              className="btn btn-primary"
              onClick={addToList}
              disabled={unaddedUserLists.length === 0}
            >
              Add to List
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
          <ReviewList
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
