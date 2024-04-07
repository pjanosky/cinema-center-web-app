import { User } from "../../types";
import React, { useCallback, useEffect, useState } from "react";
import UserList from "./userList";
import { useParams } from "react-router";
import * as client from "../client";

export default function Following() {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const fetchFollowing = useCallback(async () => {
    if (id) {
      const users = await client.getFollowing(id);
      setUsers(users);
    }
  }, [id]);
  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  return (
    <div>
      <h2>Following</h2>
      <UserList users={users} />
    </div>
  );
}
