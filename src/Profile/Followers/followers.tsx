import { User } from "../../types";
import React, { useCallback, useEffect, useState } from "react";
import UserList from "./userList";
import { useParams } from "react-router";
import * as client from "./client";

export default function Followers() {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const fetchFollowers = useCallback(async () => {
    if (id) {
      const users = await client.getFollowers(id);
      setUsers(users);
    }
  }, [id]);
  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  return (
    <div>
      <h1>Followers</h1>
      <UserList users={users} />
    </div>
  );
}
