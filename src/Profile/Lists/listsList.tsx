import { useState } from "react";
import { List } from "../../types";
import * as client from "../client";
import { Link } from "react-router-dom";
import { IfMatchingUser } from "../../Account/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../Account/hooks";
import ListEditor from "../../List/listEditor";

export default function ListsList({
  lists,
  setLists,
  showList,
  removeMovie,
}: {
  lists: List[];
  setLists: (setter: (lists: List[]) => List[]) => void;
  showList?: (list: List) => boolean;
  removeMovie?: (listId: string) => void;
}) {
  const [editingList, setEditingList] = useState<List | undefined>(undefined);
  const currentUser = useUser();

  const deleteList = async (list: List) => {
    try {
      await client.deleteList(list._id);
      setLists((lists) => lists.filter((l) => l._id !== list._id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ul className="list-group">
      {lists
        .filter((list) => !showList || showList(list))
        .map((list) => (
          <li key={list._id} className="list-group-item">
            {editingList && list._id === editingList?._id ? (
              <ListEditor
                editingList={editingList}
                setEditingList={setEditingList}
                updateList={(updatedList) =>
                  setLists((lists) =>
                    lists.map((list) =>
                      list._id === updatedList._id ? updatedList : list
                    )
                  )
                }
              />
            ) : (
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="fw-bold">{list.title}</div>
                  <div>{list.description}</div>
                  <div className="mb-2">
                    {list.movies.length} Movie
                    {list.movies.length === 1 ? "" : "s"}
                  </div>
                  <IfMatchingUser userId={list.userId}>
                    <div className="mb-2 d-flex gap-2">
                      <Link
                        to={`/list/${list._id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <button className="btn btn-primary">
                          View Details
                        </button>
                      </Link>
                      {removeMovie ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => removeMovie(list._id)}
                        >
                          Remove from list
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingList(list)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteList(list)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </IfMatchingUser>
                </div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="flex-shrink-0"
                />
              </div>
            )}
          </li>
        ))}
    </ul>
  );
}
