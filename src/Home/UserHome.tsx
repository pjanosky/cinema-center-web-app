import { useState, useCallback, useEffect } from "react";
import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import reviewsClient from "../API/Reviews/client";
import { Review } from "../API/Reviews/types";
import { useCurrentUser } from "../Account/hooks";
import ListList from "../List/ListList";
import ReviewsList from "../Movies/ReviewsList";

export default function UserHome() {
  const [lists, setLists] = useState<List[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [followerReviews, setFollowerReviews] = useState<Review[]>([]);
  const currentUser = useCurrentUser();

  const fetchLists = useCallback(async () => {
    try {
      const recentLists = await listsClient.getRecentLists(5);
      setLists(recentLists);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchFollowerReviews = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const reviews = await reviewsClient.getFollowerReviews(currentUser?._id);
      setFollowerReviews(reviews.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  }, [currentUser?._id]);
  const fetchMyReviews = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const reviews = await reviewsClient.getReviewsByUser(currentUser?._id);
      setMyReviews(reviews.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);
  useEffect(() => {
    fetchFollowerReviews();
  }, [fetchFollowerReviews]);
  useEffect(() => {
    fetchMyReviews();
  }, [fetchMyReviews]);

  return (
    <div>
      <div className="mb-4">
        <h2>What to Watch</h2>
        <h5 className="mb-3">Recent watch lists curated by our editors</h5>
        <ListList lists={lists} setLists={setLists} />
      </div>
      <div className="mb-4">
        <h2>Recent Follower Reviews</h2>
        <h5 className="mb-3">Recent movie reviews created by my followers</h5>
        <ReviewsList
          reviews={followerReviews}
          setReviews={setFollowerReviews}
        />
      </div>
      <div className="mb-4">
        <h2>My Recent Reviews</h2>
        <h5 className="mb-3">Recent movie reviews created by me</h5>
        <ReviewsList reviews={myReviews} setReviews={setMyReviews} />
      </div>
    </div>
  );
}
