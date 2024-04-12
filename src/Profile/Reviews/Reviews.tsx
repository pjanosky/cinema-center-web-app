import { useCallback, useEffect, useState } from "react";
import { useRefetchOnUnauthorized } from "../../Account/hooks";
import ReviewsList from "../../Movies/ReviewsList";
import { useParams } from "react-router";
import { Review } from "../../API/Reviews/types";
import reviewsClient from "../../API/Reviews/client";

export default function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const refetchOnUnauthorized = useRefetchOnUnauthorized();

  const fetchReviews = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const response = await reviewsClient.getReviewsByUser(id);
      setReviews(response);
    } catch (error) {
      refetchOnUnauthorized(error);
      console.log(error);
    }
  }, [id, refetchOnUnauthorized]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      <h2>Reviews</h2>
      <ReviewsList reviews={reviews} setReviews={setReviews} />
    </div>
  );
}
