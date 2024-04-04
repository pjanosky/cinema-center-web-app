import { useCallback, useEffect, useState } from "react";
import { Button, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import * as client from "./client";
import UserList from "../Profile/Followers/userList";
import MoviesList from "./moviesList";
import { Movie, User } from "../types";
import { useSearchParams } from "react-router-dom";

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
    movies: [] as Movie[],
    users: [] as User[],
  });

  const search = useCallback(async () => {
    if (!query) {
      return;
    }
    try {
      switch (mode) {
        case "users":
          const userResults = await client.searchUsers(query);
          setResults((results) => ({ users: userResults, movies: [] }));
          break;
        case "movies":
          const movieResults = await client.searchMovies(query);
          setResults((results) => ({ movies: movieResults, users: [] }));
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }, [mode, query]);
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
          placeholder="Search for a movie or user"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setQuery(queryInput)}
        />
        <Button onClick={() => setQuery(queryInput)}>
          <FaSearch />
        </Button>
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
