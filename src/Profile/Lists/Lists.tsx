import { isAxiosError } from "axios";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import listsClient from "../../API/Lists/client";
import { List, NewList } from "../../API/Lists/types";
import { IfMatchingUser } from "../../Users/Components";
import ListList from "../../List/ListList";
import EmptyStateGraphic from "../../EmptyState";
import { faList } from "@fortawesome/free-solid-svg-icons";

export default function Lists() {
  const { id } = useParams();
  const [lists, setLists] = useState<List[]>([]);
  const [newList, setNewList] = useState<NewList>({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");

  const fetchLists = useCallback(async () => {
    if (!id) return;
    try {
      const lists = await listsClient.getListsByUser(id);
      setLists(lists);
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  const addList = async () => {
    setError("");
    try {
      const list = await listsClient.createList(newList);
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
      <IfMatchingUser userId={id}>
        <div className="mb-4" style={{ maxWidth: "800px" }}>
          <h3>Create a new list</h3>
          <div className="mb-3">
            <label className="w-100">
              Title
              <input
                className="form-control"
                value={newList.title}
                onChange={(e) =>
                  setNewList((newList) => ({
                    ...newList,
                    title: e.target.value,
                  }))
                }
                placeholder="Title your list"
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
                placeholder="Describe what kinds of movies are in this list"
              ></textarea>
            </label>
          </div>
          <div className="mb-3">
            <button className="btn btn-primary" onClick={addList}>
              Create List
            </button>
          </div>
          {error && (
            <div className="mb-3">
              <div className="alert alert-danger">{error}</div>
            </div>
          )}
        </div>
      </IfMatchingUser>
      <IfMatchingUser userId={id}>
        <h3>Existing Lists</h3>{" "}
      </IfMatchingUser>
      {lists.length > 0 ? (
        <ListList lists={lists} setLists={setLists} />
      ) : (
        <EmptyStateGraphic
          name="No lists"
          icon={faList}
          subtitle="Add a list above"
          userId={id}
        />
      )}
    </div>
  );
}
