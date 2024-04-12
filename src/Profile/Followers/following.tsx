import React, { useCallback, useEffect, useState } from "react";
import UserList from "./UserList";
import { useParams } from "react-router";
import { User } from "../../API/Users/types";
import usersClient from "../../API/Users/client";

export default function Following() {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const fetchFollowing = useCallback(async () => {
    if (id) {
      const users = await usersClient.getFollowing(id);
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
