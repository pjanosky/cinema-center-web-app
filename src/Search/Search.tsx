import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState, useEffect } from "react";
import { InputGroup } from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import moviesClient from "../API/Movies/client";
import { MovieResult } from "../API/Movies/types";
import usersClient from "../API/Users/client";
import { User } from "../API/Users/types";
import MoviesList from "../Movies/MoviesList";
import UserList from "../Users/UserList";
import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import ListList from "../List/ListList";
import EmptyStateGraphic from "../EmptyState";

function useIndependentSearchParam(
  name: string
): [string | undefined, (value: string) => void] {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const param = searchParams.get(name) || undefined;
  const setParam = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(name, value);
      navigate(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, name, navigate, pathname]
  );
  return [param, setParam];
}

type Mode = "movie" | "list" | "user";

export default function Search() {
  const [rawMode, setMode] = useIndependentSearchParam("mode");
  const mode: Mode =
    rawMode && ["movie", "list", "user"].includes(rawMode)
      ? (rawMode as Mode)
      : "movie";
  const [query, setQuery] = useIndependentSearchParam("query");
  const [queryInput, setQueryInput] = useState(query || "");
  const [results, setResults] = useState({
    movies: [] as MovieResult[],
    users: [] as User[],
    lists: [] as List[],
  });

  const search = useCallback(async () => {
    if (!query) return;
    try {
      switch (mode) {
        case "user":
          const userResults = await usersClient.searchUsers(query);
          setResults((results) => ({ ...results, users: userResults }));
          break;
        case "movie":
          const movieResults = await moviesClient.searchMovies(query);
          setResults((results) => ({ ...results, movies: movieResults }));
          break;
        case "list":
          const listResults = await listsClient.searchLists(query);
          setResults((results) => ({ ...results, lists: listResults }));
      }
    } catch (error) {
      console.log(error);
    }
  }, [mode, query]);

  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    setQueryInput(query || "");
    if (!query) {
      setResults({ movies: [], users: [], lists: [] });
    }
  }, [query, setQueryInput]);

  const searchSelect = (width: string) => (
    <select
      className="form-select"
      style={{ maxWidth: width }}
      value={mode}
      onChange={(e) => setMode(e.target.value)}
    >
      <option value={"movie"}>Movies</option>
      <option value={"list"}>Lists</option>
      <option value={"user"}>Users</option>
    </select>
  );
  const searchInput = (
    <input
      className="form-control"
      placeholder={`Search for a ${mode}...`}
      value={queryInput}
      onChange={(e) => setQueryInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && setQuery(queryInput)}
    />
  );
  const searchButton = (
    <button className="btn btn-primary" onClick={() => setQuery(queryInput)}>
      <FontAwesomeIcon icon={faSearch} className="me-2" />
      <span>Search</span>
    </button>
  );

  const emptyStateGraphic = (
    <EmptyStateGraphic
      name="No results"
      icon={faSearch}
      subtitle="Try a different search"
    />
  );

  return (
    <div>
      <h1>Search</h1>
      <div className="mb-4">
        <InputGroup className="mb-4 d-none d-sm-flex">
          {searchSelect("110px")}
          {searchInput}
          {searchButton}
        </InputGroup>
        <div className="d-flex d-sm-none flex-column align-items-stretch gap-2">
          {searchSelect("100%")}
          {searchInput}
          {searchButton}
        </div>
      </div>

      {query ? (
        <div>
          {mode === "movie" && (
            <div>
              <h2>Results</h2>
              {results.movies.length > 0 ? (
                <MoviesList movies={results.movies} />
              ) : (
                emptyStateGraphic
              )}
            </div>
          )}
          {mode === "user" && (
            <div>
              <h2>Results ({results.users.length})</h2>
              {results.users.length > 0 ? (
                <UserList users={results.users} />
              ) : (
                emptyStateGraphic
              )}
            </div>
          )}
          {mode === "list" && (
            <div>
              <h2>Results ({results.lists.length})</h2>
              {results.lists.length > 0 ? (
                <ListList
                  lists={results.lists}
                  setLists={(setter) =>
                    setResults({ ...results, lists: setter(results.lists) })
                  }
                  editable={false}
                />
              ) : (
                emptyStateGraphic
              )}
            </div>
          )}
        </div>
      ) : (
        <EmptyStateGraphic
          name="Search"
          icon={faSearch}
          subtitle="Enter a search term to get started"
        />
      )}
    </div>
  );
}
