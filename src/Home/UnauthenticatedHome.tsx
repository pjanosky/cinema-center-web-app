import { useCallback, useEffect, useState } from "react";
import { List } from "../API/Lists/types";
import { Review } from "../API/Reviews/types";
import reviewsClient from "../API/Reviews/client";
import listsClient from "../API/Lists/client";
import ListList from "../List/ListList";
import ReviewsList from "../Movies/ReviewsList";

export default function UnauthenticatedHome() {
  const [lists, setLists] = useState<List[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchLists = useCallback(async () => {
    try {
      const recentLists = await listsClient.getRecentLists(5);
      setLists(recentLists);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchReviews = useCallback(async () => {
    try {
      const recentReviews = await reviewsClient.getRecentReviews(10);
      setReviews(recentReviews);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      <div className="mb-4">
        <h2>What to Watch</h2>
        <h5 className="mb-3">Recent watch lists curated by our editors</h5>
        <ListList lists={lists} setLists={setLists} />
      </div>

      <div className="mb-4">
        <h2>Recent Reviews</h2>
        <h5 className="mb-3">Recent movie reviews created by watchers</h5>
        <ReviewsList reviews={reviews} setReviews={setReviews} />
      </div>
    </div>
  );
}
