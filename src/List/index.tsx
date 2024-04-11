import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import * as client from "./client";
import { List, ListEntry } from "../types";
import ListItem from "./listItem";
import ListEditor from "./listEditor";
import { IfMatchingUser } from "../Account/components";

export default function ListDetails() {
  const { id } = useParams();

  const [list, setList] = useState<List | undefined>();
  const [editingList, setEditingList] = useState<List | undefined>();

  const fetchList = useCallback(async () => {
    if (!id) return;
    try {
      const list = await client.getList(id);
      setList(list);
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  const setEntry = async (updatedEntry: ListEntry) => {
    if (!list) return;
    setList({
      ...list,
      movies: list.movies.map((entry) =>
        entry.movieId === updatedEntry.movieId ? updatedEntry : entry
      ),
    });
  };
  const deleteEntry = async (entry: ListEntry) => {
    if (!list) return;
    setList({
      ...list,
      movies: list.movies.filter((e) => e.movieId !== entry.movieId),
    });
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  if (!list) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {editingList ? (
        <div>
          <h2>Edit List</h2>
          <ListEditor
            editingList={editingList}
            setEditingList={setEditingList}
            updateList={setList}
          />
        </div>
      ) : (
        <div className="d-flex">
          <div className="flex-shrink-1 flex-grow-1">
            <h1>{list.title}</h1>
            <div className="mb-3">{list.description && list.description}</div>
          </div>
          <IfMatchingUser userId={list.userId}>
            <div className="flex-shrink-0 flex-grow-0">
              <button
                className="btn btn-primary"
                onClick={() => setEditingList(list)}
              >
                Edit List
              </button>
            </div>
          </IfMatchingUser>
        </div>
      )}
      <ul className="list-group">
        <h2>Movies</h2>
        {list.movies.map((entry) => (
          <li key={entry.movieId} className="list-group-item">
            <ListItem
              entry={entry}
              list={list}
              setEntry={setEntry}
              deleteEntry={deleteEntry}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
