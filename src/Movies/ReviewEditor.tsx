import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Rating, Review } from "../API/Reviews/types";

export default function ReviewEditor({
  review,
  setReview,
}: {
  review: Review;
  setReview: (setter: (review: Review) => Review) => void;
}) {
  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="mb-3">
        <label className="w-100">
          Rating
          <div className="d-flex align-items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
              <FontAwesomeIcon
                icon={faStar}
                onClick={() =>
                  setReview((review) => ({ ...review, rating: i as Rating }))
                }
                key={i}
                style={{
                  color: review.rating && i <= review.rating ? "gold" : "gray",
                  fontSize: "2em",
                }}
              />
            ))}
            <span className="ms-2">
              {review.rating} Star{review.rating > 1 ? "s" : ""}
            </span>
          </div>
        </label>
        <small className="form-text text-muted">
          Click on a star to change your rating
        </small>
      </div>
      <div className="mb-3">
        <label className="w-100">
          Title
          <input
            type="text"
            className="form-control"
            placeholder="Title your review"
            title="Review Title"
            value={review.title}
            onChange={(e) =>
              setReview((review) => ({ ...review, title: e.target.value }))
            }
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="w-100">
          Review
          <textarea
            className="form-control"
            value={review.content}
            title="Review content"
            placeholder="What did you think about the movie?"
            onChange={(e) =>
              setReview((review) => ({ ...review, content: e.target.value }))
            }
            style={{ height: "200px" }}
          />
        </label>
      </div>
    </div>
  );
}
