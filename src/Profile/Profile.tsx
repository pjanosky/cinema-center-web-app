import ProfileNavigation from "./Navigation/ProfileNavigation";
import { Navigate, Route, Routes, useParams } from "react-router";
import Account from "./Account/Account";
import Reviews from "./Reviews/Reviews";
import Followers from "./Followers/Followers";
import Following from "./Followers/Following";
import { useRefetchUser, useCurrentUser } from "../Account/hooks";
import Lists from "./Lists/Lists";
import Likes from "./Likes/Likes";
import usersClient from "../API/Users/client";
import { useCallback, useEffect, useState } from "react";
import { User } from "../API/Users/types";

export default function Profile() {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const refreshUser = useRefetchUser();
  const [user, setUser] = useState<User | undefined>();

  const showFollow =
    currentUser && user && currentUser._id !== id && user.role === "user";
  const following = currentUser && id && currentUser.following.includes(id);

  const follow = async () => {
    if (currentUser && id) {
      await usersClient.followUser(currentUser._id, id);
      await refreshUser();
    }
  };
  const unfollow = async () => {
    if (currentUser && id) {
      await usersClient.unfollowUser(currentUser._id, id);
      await refreshUser();
    }
  };

  const fetchUser = useCallback(async () => {
    if (!id) return;
    try {
      const user = await usersClient.getUserById(id);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

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
        <span>@{user?.username || ""}</span>{" "}
        <span style={{ color: "gray" }}>
          {" - "}
          {user?.role || ""}
        </span>
      </h5>

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