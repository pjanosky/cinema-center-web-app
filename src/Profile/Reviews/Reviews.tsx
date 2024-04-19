import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import reviewsClient from "../../API/Reviews/client";
import { Review } from "../../API/Reviews/types";
import { useRefetchOnUnauthorized } from "../../Users/Hooks";
import ReviewList from "../../Reviews/ReviewList";
import EmptyStateGraphic from "../../EmptyState";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

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
      <h2>Reviews ({reviews.length})</h2>
      {reviews.length > 0 ? (
        <ReviewList reviews={reviews} setReviews={setReviews} />
      ) : (
        <EmptyStateGraphic
          name="No reviews"
          icon={faMessage}
          subtitle="Search for a movie to add a review"
          userId={id}
        />
      )}
    </div>
  );
}
