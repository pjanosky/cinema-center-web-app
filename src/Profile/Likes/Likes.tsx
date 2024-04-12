import { useCallback, useEffect, useState } from "react";
import ReviewsList from "../../Movies/ReviewsList";
import { useParams } from "react-router";
import { Review } from "../../API/Reviews/types";
import reviewsClient from "../../API/Reviews/client";

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
