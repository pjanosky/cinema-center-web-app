import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import listsClient from "../API/Lists/client";
import { ListEntry, List } from "../API/Lists/types";
import moviesClient from "../API/Movies/client";
import { Movie } from "../API/Movies/types";
import { IfUser, IfMatchingUser } from "../Account/Components";
import { useRefetchOnUnauthorized, useCurrentUser } from "../Account/hooks";
import MoviePoster from "../Movies/MoviePoster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

export default function EntryItem({
  entry,
  list,
  setList,
}: {
  entry: ListEntry;
  list: List;
  setList: (setter: (list: List) => List) => void;
}) {
  const [movie, setMove] = useState<Movie | undefined>();
  const [editingEntry, setEditingEntry] = useState<ListEntry | undefined>();
  const refetchOnUnauthorized = useRefetchOnUnauthorized();
  const currentUser = useCurrentUser();

  const updateEntry = async () => {
    if (!editingEntry) return;
    try {
      const updatedEntry = await listsClient.updateEntryInList(
        list._id,
        editingEntry
      );
      setList((list) => ({
        ...list,
        entries: list.entries.map((entry) =>
          entry.movieId === updatedEntry.movieId ? updatedEntry : entry
        ),
      }));
      setEditingEntry(undefined);
    } catch (error) {
      refetchOnUnauthorized(error);
      console.log(error);
    }
  };
  const removeEntry = async () => {
    try {
      await listsClient.removeEntryFromList(list._id, entry.movieId);
      setList((list) => ({
        ...list,
        entries: list.entries.filter((e) => e.movieId !== entry.movieId),
      }));
    } catch (error) {
      refetchOnUnauthorized(error);
      console.log(error);
    }
  };

  const fetchMovieDetails = useCallback(async () => {
    try {
      const movieDetails = await moviesClient.getMovieById(entry.movieId);
      setMove(movieDetails);
    } catch (error) {
      console.log(error);
    }
  }, [entry.movieId]);
  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  return (
    <div className="d-flex gap-3 my-2">
      <div
        style={{ width: "92px", height: "138px" }}
        className="flex-shrink-0 flex-grow-0"
      >
        {movie && movie.poster_path && (
          <MoviePoster size="w92" path={movie.poster_path}>
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "var(--secondary-2)" }}
            >
              <FontAwesomeIcon
                icon={faVideo}
                style={{ color: "var(--secondary-1)", fontSize: "2rem" }}
              />
            </div>
          </MoviePoster>
        )}
      </div>
      <div className="flex-shrink-1 flex-grow-1 d-flex flex-column justify-content-between flex-wrap">
        <div>
          <div className="fw-bold cc-link">
            {currentUser && currentUser._id === list.userId ? (
              <Link to={`/details/${entry.movieId}`}>
                {movie && movie?.title}
              </Link>
            ) : (
              <>{movie && movie?.title}</>
            )}
          </div>
          <IfUser>
            <div style={{ color: "var(--secondary-1)" }}>
              {movie?.release_date &&
                new Date(movie.release_date).getFullYear()}
            </div>
          </IfUser>
          {editingEntry ? (
            <div>
              <textarea
                className="form-control"
                value={editingEntry.description}
                rows={5}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    description: e.target.value,
                  })
                }
                placeholder="Describe this movie to watchers"
              ></textarea>
            </div>
          ) : (
            <div style={{ whiteSpace: "pre-wrap", minWidth: "200px" }}>
              {entry.description}
            </div>
          )}
        </div>
        <IfMatchingUser userId={list.userId}>
          <div className="d-flex gap-2 mt-2 flex-wrap">
            {editingEntry ? (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingEntry(undefined)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={updateEntry}>
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingEntry(entry)}
                >
                  Edit description
                </button>
                <button className="btn btn-danger" onClick={removeEntry}>
                  Remove
                </button>
              </>
            )}
          </div>
        </IfMatchingUser>
      </div>
    </div>
  );
}
