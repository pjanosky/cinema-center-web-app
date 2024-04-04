import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import ProfileNavigation from "./Navigation";
import { Navigate, Route, Routes, useParams } from "react-router";
import Account from "./Account";
import Reviews from "./Reviews";
import Followers from "./Followers/followers";
import Following from "./Followers/following";
import { User } from "../types";
import * as client from "./Followers/client";
import { useRefreshUser, useUser } from "../Account/hooks";
import Lists from "./Lists";

export default function Profile() {
  const currentUser = useUser();
  const refreshUser = useRefreshUser();
  const { id } = useParams();
  const [user, setUser] = useState<User | undefined>();
  const fetchUser = useCallback(async () => {
    if (id) {
      const user = await client.getUser(id);
      setUser(user);
    }
  }, [id]);
  useEffect(() => {
    fetchUser();
  }, [fetchUser, id]);
  const showFollow = currentUser && currentUser?._id !== id;
  const following = currentUser && id && currentUser.following.includes(id);
  const follow = async () => {
    if (currentUser && id) {
      await client.addFollower(currentUser._id, id);
      refreshUser();
    }
  };
  const unfollow = async () => {
    if (currentUser && id) {
      await client.removeFollower(currentUser._id, id);
      refreshUser();
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

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
      Username: {user?.username || ""}
      <ProfileNavigation user={user}>
        <Routes>
          <Route
            path=""
            element={
              <Navigate
                to={user.role === "user" ? "lists" : "reviews"}
                replace={true}
              />
            }
          />
          <Route path="reviews" element={<Reviews user={user} />} />
          <Route path="followers" element={<Followers />} />
          <Route path="following" element={<Following />} />
          <Route path="account" element={<Account />} />
          <Route path="lists" element={<Lists user={user} />} />
        </Routes>
      </ProfileNavigation>
    </div>
  );
}
