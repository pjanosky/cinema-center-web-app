import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import usersClient from "../../API/Users/client";
import { User } from "../../API/Users/types";
import UserList from "../../Users/UserList";
import EmptyStateGraphic from "../../EmptyState";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

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
      <h2>Followers ({users.length})</h2>
      {users.length > 0 ? (
        <UserList users={users} />
      ) : (
        <EmptyStateGraphic
          name="followers"
          icon={faUsers}
          subtitle="Other users who follow you will appear here"
          userId={id}
        />
      )}
    </div>
  );
}
