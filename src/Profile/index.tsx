import React, { useCallback, useEffect, useState } from "react";

import ProfileNavigation from "./Navigation";
import { Navigate, Route, Routes, useParams } from "react-router";
import Account from "./Account";
import Reviews from "./Reviews";
import Followers from "./Followers/followers";
import Following from "./Followers/following";
import { User } from "../types";
import * as client from "./client";
import { useRefreshUser, useUser } from "../Account/hooks";
import Lists from "./Lists";
import Likes from "./Likes";

export default function Profile() {
  const currentUser = useUser();
  const refreshUser = useRefreshUser();
  const { id } = useParams();
  const [user, setUser] = useState<User | undefined>();
  const fetchUser = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const user = await client.getUser(id);
      setUser(user);
    } catch (error) {
      console.log(error);
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
      await refreshUser();
    }
  };
  const unfollow = async () => {
    if (currentUser && id) {
      await client.removeFollower(currentUser._id, id);
      await refreshUser();
    }
  };

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
      <h4>@{user?.username || ""}</h4>
      <ProfileNavigation user={user}>
        <Routes>
          <Route
            path=""
            element={
              <Navigate
                to={user.role === "user" ? "reviews" : "lists"}
                replace={true}
              />
            }
          />
          <Route path="reviews" element={<Reviews user={user} />} />
          <Route path="likes" element={<Likes user={user} />} />
          <Route path="followers" element={<Followers />} />
          <Route path="following" element={<Following />} />
          <Route path="account" element={<Account />} />
          <Route path="lists" element={<Lists user={user} />} />
        </Routes>
      </ProfileNavigation>
    </div>
  );
}
