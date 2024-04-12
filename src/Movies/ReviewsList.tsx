import { useState } from "react";
import { Review } from "../API/Reviews/types";
import reviewsClient from "../API/Reviews/client";
import ReviewEditor from "./ReviewEditor";
import ReviewItem from "./ReviewItem";

export default function ReviewsList({
  reviews,
  setReviews,
  showReview,
}: {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  showReview?: (review: Review) => boolean;
}) {
  const [editingReview, setEditingReview] = useState<Review | undefined>();
  const [error, setError] = useState("");

  const reviewEditorSetter = (setter: (review: Review) => Review) =>
    setEditingReview((editingReview) => editingReview && setter(editingReview));
  const deleteReview = async (review: Review) => {
    try {
      await reviewsClient.deleteReview(review._id);
      setReviews(reviews.filter((r) => r._id !== review._id));
    } catch (error) {
      setError("Error deleting review");
    }
  };
  const updateReview = async (review: Review) => {
    try {
      const updatedReview = await reviewsClient.updateReview(review);
      setReviews(
        reviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
      setEditingReview(undefined);
    } catch (error) {
      setError("Error saving review");
    }
  };

  return (
    <ul className="list-group">
      {reviews
        .filter((review) => !showReview || showReview(review))
        .map((review) => (
          <li key={review._id} className="list-group-item">
            {editingReview && review._id === editingReview._id ? (
              <div>
                <ReviewEditor
                  review={editingReview}
                  setReview={reviewEditorSetter}
                />
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary mb-2"
                    onClick={() => setEditingReview(undefined)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary mb-2"
                    onClick={() => updateReview(editingReview)}
                  >
                    Save
                  </button>
                </div>
                {error && <div className="alert alert-danger">error</div>}
              </div>
            ) : (
              <ReviewItem
                review={review}
                deleteReview={deleteReview}
                editReview={(review) => setEditingReview(review)}
                setReview={(review) =>
                  setReviews(
                    reviews.map((r) => (r._id === review._id ? review : r))
                  )
                }
              />
            )}
          </li>
        ))}
    </ul>
  );
}
