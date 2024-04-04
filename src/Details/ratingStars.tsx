import { FaStar } from "react-icons/fa";

export default function RatingStars({
  voteAverage,
  voteCount,
}: {
  voteAverage: number | undefined;
  voteCount: number | undefined;
}) {
  if (!voteAverage) {
    return <></>;
  }
  const stars = Math.round(voteAverage / 2);
  return (
    <div className="d-flex align-items-center">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
        <FaStar key={i} style={{ color: i <= stars ? "gold" : "lightgray" }} />
      ))}
      {voteCount && <span className="ms-1">({voteCount} Ratings)</span>}
    </div>
  );
}
