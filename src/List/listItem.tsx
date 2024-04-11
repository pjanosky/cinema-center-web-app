import { useCallback, useEffect, useState } from "react";
import { List, ListEntry, MovieDetails } from "../types";
import * as movieClient from "../Details/client";
import Poster from "../Search/poster";
import { Link } from "react-router-dom";
import { IfMatchingUser, IfUser } from "../Account/components";
import * as client from "./client";
import RatingStars from "../Details/ratingStars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function ListItem({
  entry,
  list,
  setEntry,
  deleteEntry,
}: {
  entry: ListEntry;
  list: List;
  setEntry: (entry: ListEntry) => void;
  deleteEntry: (entry: ListEntry) => void;
}) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | undefined>();
  const [editingEntry, setEditingEntry] = useState<ListEntry | undefined>();

  const fetchMovieDetails = useCallback(async () => {
    try {
      const movieDetails = await movieClient.getMoveDetails(entry.movieId);
      setMovieDetails(movieDetails);
    } catch (error) {
      console.log(error);
    }
  }, [entry.movieId]);
  const updateEntry = async () => {
    if (!editingEntry) return;
    try {
      const updatedEntry = await client.updateMovieInList(
        list._id,
        editingEntry
      );
      setEntry(updatedEntry);
      setEditingEntry(undefined);
    } catch (error) {
      console.log(error);
    }
  };
  const removeEntry = async () => {
    try {
      await client.deleteMovieFromList(list._id, entry.movieId);
      deleteEntry(entry);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  if (!movieDetails) {
    return <></>;
  }

  return (
    <div className="d-flex gap-3 my-2">
      <div
        style={{ width: "92px", height: "138px" }}
        className="flex-shrink-0 flex-grow-0"
      >
        <Poster size="w92" path={movieDetails.poster_path} />
      </div>
      <div className="flex-shrink-1 flex-grow-1 d-flex flex-column justify-content-between">
        <div>
          <Link to={`/details/${entry.movieId}`} className="fw-bold cc-link">
            {movieDetails && movieDetails?.title}
          </Link>
          <IfUser>
            <div className="d-flex gap-3" style={{ color: "black" }}>
              {movieDetails.release_date &&
                new Date(movieDetails.release_date).getFullYear()}
              {movieDetails?.stars && (
                <RatingStars stars={movieDetails.stars} />
              )}
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
                placeholder="Description"
              ></textarea>
            </div>
          ) : (
            <div>{entry.description}</div>
          )}
        </div>
        <IfMatchingUser userId={list.userId}>
          <div className="d-flex gap-2 mt-2">
            <button
              className="btn btn-primary"
              onClick={() =>
                editingEntry ? updateEntry() : setEditingEntry(entry)
              }
            >
              {editingEntry ? "Save" : "Edit description"}
            </button>
            <button className="btn btn-danger" onClick={removeEntry}>
              Remove
            </button>
          </div>
        </IfMatchingUser>
      </div>
    </div>
  );
}
