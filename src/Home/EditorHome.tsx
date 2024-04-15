import { useState, useCallback, useEffect } from "react";
import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import { useCurrentUser } from "../Account/hooks";
import ListList from "../List/ListList";

export default function EditorHome() {
  const currentUser = useCurrentUser();
  const [myLists, setMyLists] = useState<List[]>([]);
  const [recentLists, setRecentLists] = useState<List[]>([]);

  const fetchMyLists = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const lists = await listsClient.getListsByUser(currentUser._id);
      setMyLists(lists.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  }, [currentUser?._id]);
  const fetchRecentLists = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const lists = await listsClient.getRecentLists(5);
      setRecentLists(lists);
    } catch (error) {
      console.log(error);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    fetchMyLists();
  }, [fetchMyLists]);
  useEffect(() => {
    fetchRecentLists();
  }, [fetchRecentLists]);

  return (
    <div>
      <div className="mb-4">
        <h2>My Recent Lists</h2>
        <h5 className="mb-3">Recent lists created by me</h5>
        <ListList lists={myLists} setLists={setMyLists} />
      </div>
      <div className="mb-4">
        <h2>All Recent Lists</h2>
        <h5 className="mb-3">Recent lists created by all editors</h5>
        <ListList
          lists={recentLists}
          setLists={setRecentLists}
          editable={false}
        />
      </div>
    </div>
  );
}
