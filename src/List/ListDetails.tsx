import { useParams } from "react-router";
import ListEditor from "./ListEditor";
import { IfMatchingUser } from "../Account/components";
import { List } from "../API/Lists/types";
import listsClient from "../API/Lists/client";
import usersClient from "../API/Users/client";
import { User } from "../API/Users/types";
import { Link } from "react-router-dom";
import EntryList from "./EntryList";
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function ListDetails() {
  const { id } = useParams();

  const [list, setList] = useState<List | undefined>();
  const [editingList, setEditingList] = useState<List | undefined>();
  const [user, setUser] = useState<User | undefined>();

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
  });
  const date = list && dateFormatter.format(new Date(list.date));

  const fetchList = useCallback(async () => {
    if (!id) return;
    try {
      const list = await listsClient.getListById(id);
      setList(list);
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  const fetchUser = useCallback(async () => {
    if (!list?.userId) return;
    try {
      const user = await usersClient.getUserById(list.userId);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }, [list?.userId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div>
      {editingList ? (
        <div>
          <h2>Edit List</h2>
          <ListEditor
            editingList={editingList}
            setEditingList={setEditingList}
            setList={setList}
          />
        </div>
      ) : (
        <div className="d-flex">
          <div className="flex-shrink-1 flex-grow-1">
            <h1>{list?.title || ""}</h1>
            <div className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
              {list && list.description}
            </div>
            <div className="mb-3">
              <FontAwesomeIcon icon={faUser} />
              <span> Created by </span>
              <Link
                to={`/profile/${list?.userId}`}
                className="cc-link p-0 m-0"
                style={{ textDecorationLine: "underline important" }}
              >
                {user && user.name}
              </Link>
              <span> on {date}</span>
            </div>
          </div>
          <IfMatchingUser userId={list?.userId || ""}>
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
      <h2>Movies</h2>
      {list && (
        <EntryList
          list={list}
          setList={(setter) => setList((list) => list && setter(list))}
        />
      )}
    </div>
  );
}
