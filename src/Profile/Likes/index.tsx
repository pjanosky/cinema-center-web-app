import { useCallback, useEffect, useState } from "react";
import { Review, User } from "../../types";
import * as client from "../client";
import { useRefreshOnUnauthorized } from "../../Account/hooks";
import ReviewsList from "../../Details/reviewsList";
import { useParams } from "react-router";

export default function Likes({ user }: { user: User }) {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const refreshOnUnauthorized = useRefreshOnUnauthorized();

  const fetchReviews = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const response = await client.getLikesForUser(id);
      setReviews(response);
    } catch (error) {
      refreshOnUnauthorized(error);
      console.log(error);
    }
  }, [id, refreshOnUnauthorized]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      <h2>Likes</h2>
      <ReviewsList
        reviews={reviews}
        setReviews={setReviews}
        showReview={(review) => !!id && review.likes.includes(id)}
      />
    </div>
  );
}
