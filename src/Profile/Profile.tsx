import { useState, useCallback, useEffect } from "react";
import { useParams, Routes, Route, Navigate } from "react-router";
import usersClient from "../API/Users/client";
import { User, isEditorUser, isWatcherUser } from "../API/Users/types";
import { useCurrentUser, useRefetchUser } from "../Users/Hooks";
import Account from "./Account/Account";
import Followers from "./Followers/Followers";
import Following from "./Following/Following";
import Likes from "./Likes/Likes";
import Lists from "./Lists/Lists";
import ProfileNavigation from "./Navigation/ProfileNavigation";
import Reviews from "./Reviews/Reviews";

export default function Profile() {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const refetchUser = useRefetchUser();
  const [rawUser, setUser] = useState<User | undefined>();
  const user = currentUser && id === currentUser._id ? currentUser : rawUser;

  const showFollow =
    currentUser && user && currentUser._id !== id && user.role === "user";
  const following =
    currentUser &&
    isWatcherUser(currentUser) &&
    id &&
    currentUser.following.includes(id);

  const follow = async () => {
    if (currentUser && id) {
      await usersClient.followUser(currentUser._id, id);
      await refetchUser();
    }
  };
  const unfollow = async () => {
    if (currentUser && id) {
      await usersClient.unfollowUser(currentUser._id, id);
      await refetchUser();
    }
  };

  const fetchUser = useCallback(async () => {
    if (!id || (currentUser && id === currentUser._id)) return;
    try {
      const user = await usersClient.getUserById(id);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>{user?.name || ""}</h1>
        {showFollow && (
          <button
            className="btn btn-primary"
            onClick={following ? unfollow : follow}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
      <h5>
        <span>@{user?.username || ""}</span>
        <span style={{ color: "var(--secondary-1)" }}>
          {" - "}
          {user?.role === "editor" ? "Editor" : "Watcher"}
        </span>
      </h5>
      {user && isEditorUser(user) && user.bio && (
        <div className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
          Bio: {user.bio}
        </div>
      )}

      {user && (
        <ProfileNavigation user={user}>
          <Routes>
            <Route
              path=""
              element={
                user ? (
                  <Navigate
                    to={user.role === "user" ? "reviews" : "lists"}
                    replace={true}
                  />
                ) : (
                  <div></div>
                )
              }
            />
            <Route path="reviews" element={<Reviews />} />
            <Route path="likes" element={<Likes />} />
            <Route path="followers" element={<Followers />} />
            <Route path="following" element={<Following />} />
            <Route path="account" element={<Account />} />
            <Route path="lists" element={<Lists />} />
          </Routes>
        </ProfileNavigation>
      )}
    </div>
  );
}
