import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import reviewsClient from "../../API/Reviews/client";
import { Review } from "../../API/Reviews/types";
import ReviewList from "../../Reviews/ReviewList";
import EmptyStateGraphic from "../../EmptyState";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export default function Likes() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const response = await reviewsClient.getReviewsLikedByUser(id);
      setReviews(response);
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  const likedReviews = reviews.filter(
    (review) => !!id && review.likes.includes(id)
  );

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      <h2>Likes ({likedReviews.length})</h2>
      {likedReviews.length > 0 ? (
        <ReviewList
          reviews={reviews}
          setReviews={setReviews}
          showReview={(review) => !!id && review.likes.includes(id)}
        />
      ) : (
        <EmptyStateGraphic
          name="likes"
          subtitle="Press the heart button to like a review"
          userId={id}
          icon={faHeart}
        />
      )}
    </div>
  );
}
