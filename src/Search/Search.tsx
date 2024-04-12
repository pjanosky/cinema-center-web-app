import { useCallback, useEffect, useState } from "react";
import UserList from "../Profile/Followers/UserList";
import MoviesList from "./MoviesList";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { MovieResult } from "../API/Movies/types";
import { User } from "../API/Users/types";
import usersClient from "../API/Users/client";
import moviesClient from "../API/Movies/client";
import { InputGroup } from "react-bootstrap";

function useIndependentSearchParam(
  name: string
): [string | undefined, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get(name) || undefined;
  const setParam = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(name, value);
      setSearchParams(newSearchParams);
    },
    [name, searchParams, setSearchParams]
  );
  return [param, setParam];
}

export default function Search() {
  const [rawMode, setMode] = useIndependentSearchParam("mode");
  const mode = rawMode === "users" ? "users" : "movies";
  const [query, setQuery] = useIndependentSearchParam("query");
  const [queryInput, setQueryInput] = useState(query || "");
  const [results, setResults] = useState({
    movies: [] as MovieResult[],
    users: [] as User[],
  });

  const search = useCallback(async () => {
    if (!query) {
      return;
    }
    try {
      setMode(mode);
      switch (mode) {
        case "users":
          const userResults = await usersClient.searchUsers(query);
          setResults((results) => ({ ...results, users: userResults }));
          break;
        case "movies":
          const movieResults = await moviesClient.searchMovies(query);
          setResults((results) => ({ ...results, movies: movieResults }));
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }, [mode, query, setMode]);
  useEffect(() => {
    search();
  }, [search]);

  return (
    <div>
      <h1>Search</h1>
      <InputGroup className="mb-4">
        <select
          className="form-select"
          style={{ maxWidth: "110px" }}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value={"movies"}>Movies</option>
          <option value={"users"}>Users</option>
        </select>
        <input
          className="form-control"
          placeholder="Search..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setQuery(queryInput)}
        />
        <button
          className="btn btn-primary"
          onClick={() => setQuery(queryInput)}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </InputGroup>
      {query && <h2>Results</h2>}

      {mode === "movies" && (
        <div>
          <MoviesList movies={results.movies} />
        </div>
      )}

      {mode === "users" && (
        <div>
          <UserList users={results.users} />
        </div>
      )}
    </div>
  );
}
