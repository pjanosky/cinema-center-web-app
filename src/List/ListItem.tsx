import { useState } from "react";
import { Link } from "react-router-dom";
import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import { IfMatchingUser } from "../Account/Components";
import { useRefetchOnUnauthorized } from "../Account/hooks";
import ListEditor from "./ListEditor";

export default function ListItem({
  list,
  setLists,
  movieId,
  editable,
}: {
  list: List;
  setLists: (setter: (lists: List[]) => List[]) => void;
  movieId?: string;
  editable: boolean;
}) {
  const [editingList, setEditingList] = useState<List | undefined>();
  const refetchOnUnauthorized = useRefetchOnUnauthorized();

  const deleteList = async () => {
    try {
      await listsClient.deleteList(list._id);
      setLists((lists) => lists.filter((l) => l._id !== list._id));
    } catch (error) {
      refetchOnUnauthorized(error);
      console.log(error);
    }
  };
  const removeEntryFromList = async () => {
    if (!movieId) return;
    try {
      await listsClient.removeEntryFromList(list._id, movieId);
      setLists((lists) => lists.filter((l) => l._id !== list._id));
    } catch (error) {
      refetchOnUnauthorized(error);
      console.log(error);
    }
  };

  return editingList ? (
    <div>
      <ListEditor
        editingList={editingList}
        setEditingList={setEditingList}
        setList={(updatedList) =>
          setLists((lists) =>
            lists.map((list) =>
              list._id === updatedList._id ? updatedList : list
            )
          )
        }
      />
    </div>
  ) : (
    <div>
      <div className="fw-bold">{list.title}</div>
      <div style={{ whiteSpace: "pre-wrap" }}>{list.description}</div>
      <div className="mb-2">
        {list.entries.length} Movie
        {list.entries.length === 1 ? "" : "s"}
      </div>
      {editable && (
        <IfMatchingUser userId={list.userId}>
          <div className="mb-2 d-flex gap-2">
            {movieId ? (
              <button className="btn btn-danger" onClick={removeEntryFromList}>
                Remove from list
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditingList(list)}
                >
                  Edit
                </button>
                <button className="btn btn-danger" onClick={deleteList}>
                  Delete
                </button>
              </>
            )}
            <Link
              to={`/lists/${list._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <button className="btn btn-secondary">View Details</button>
            </Link>
          </div>
        </IfMatchingUser>
      )}
    </div>
  );
}
