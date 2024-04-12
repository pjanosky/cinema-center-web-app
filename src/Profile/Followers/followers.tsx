import React, { useCallback, useEffect, useState } from "react";
import UserList from "./UserList";
import { useParams } from "react-router";
import { User } from "../../API/Users/types";
import usersClient from "../../API/Users/client";

export default function Followers() {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const fetchFollowers = useCallback(async () => {
    if (id) {
      const users = await usersClient.getFollowers(id);
      setUsers(users);
    }
  }, [id]);
  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  return (
    <div>
      <h2>Followers</h2>
      <UserList users={users} />
    </div>
  );
}
