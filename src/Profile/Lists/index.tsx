import { useCallback, useEffect, useState } from "react";
import { List, User } from "../../types";
import * as client from "../client";
import ListsList from "./listsList";
import { isAxiosError } from "axios";

export default function Lists({ user }: { user: User }) {
  const [lists, setLists] = useState<List[]>([]);
  const [newList, setNewList] = useState<List>({
    title: "",
    description: "",
    movies: [],
    userId: user._id,
    date: "",
    _id: "",
  });
  const [error, setError] = useState("");

  const fetchLists = useCallback(async () => {
    try {
      const lists = await client.getListsForUser(user._id);
      setLists(lists);
    } catch (error) {
      console.log(error);
    }
  }, [user._id]);
  const addList = async () => {
    setError("");
    try {
      const list = await client.addList(newList);
      setLists((lists) => [...lists, list]);
      setNewList({ ...newList, title: "", description: "" });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data);
      }
    }
  };
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return (
    <div>
      <h2>Lists</h2>
      <div style={{ maxWidth: "800px" }}>
        <h3>Add a new list</h3>
        <div className="mb-3">
          <label className="w-100">
            Title
            <input
              className="form-control"
              value={newList.title}
              onChange={(e) =>
                setNewList((newList) => ({ ...newList, title: e.target.value }))
              }
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="w-100">
            Description
            <textarea
              className="form-control"
              value={newList.description}
              onChange={(e) =>
                setNewList((newList) => ({
                  ...newList,
                  description: e.target.value,
                }))
              }
            ></textarea>
          </label>
        </div>
        <div className="mb-3">
          <button className="btn btn-primary" onClick={addList}>
            Add
          </button>
        </div>
        {error && (
          <div className="mb-3">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}
      </div>
      <div>
        <h3>Existing Lists</h3>
        <ListsList lists={lists} setLists={setLists} />
      </div>
    </div>
  );
}
