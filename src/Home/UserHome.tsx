import { useState, useCallback, useEffect } from "react";
import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import reviewsClient from "../API/Reviews/client";
import { Review } from "../API/Reviews/types";
import { useCurrentUser } from "../Users/Hooks";
import ListList from "../List/ListList";
import ReviewList from "../Reviews/ReviewList";
import EmptyStateGraphic from "../EmptyState";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";

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
        {lists.length > 0 ? (
          <ListList lists={lists} setLists={setLists} />
        ) : (
          <EmptyStateGraphic
            name="No lists"
            icon={faList}
            subtitle="Stay tuned for watch lists created by out editors"
          />
        )}
      </div>
      <div className="mb-4">
        <h2>Recent Follower Reviews</h2>
        <h5 className="mb-3">Recent movie reviews created by my followers</h5>
        {followerReviews.length > 0 ? (
          <ReviewList
            reviews={followerReviews}
            setReviews={setFollowerReviews}
          />
        ) : (
          <EmptyStateGraphic
            name="No reviews"
            icon={faMessage}
            subtitle="Try searching for users to follow"
          />
        )}
      </div>
      <div className="mb-4">
        <h2>My Recent Reviews</h2>
        <h5 className="mb-3">Recent movie reviews created by me</h5>
        {myReviews.length > 0 ? (
          <ReviewList reviews={myReviews} setReviews={setMyReviews} />
        ) : (
          <EmptyStateGraphic
            name="No reviews"
            icon={faMessage}
            subtitle="Search for a movie to write a review"
          />
        )}
      </div>
    </div>
  );
}
