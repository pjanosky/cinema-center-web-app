import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import usersClient from "../../API/Users/client";
import { User } from "../../API/Users/types";
import UserList from "../../Users/UserList";
import EmptyStateGraphic from "../../EmptyState";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

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
      <h2>Following ({users.length})</h2>
      {users.length > 0 ? (
        <UserList users={users} />
      ) : (
        <EmptyStateGraphic
          name="following"
          icon={faUsers}
          subtitle="Try searching for users to follow"
          userId={id}
        />
      )}
    </div>
  );
}
