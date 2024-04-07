import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RatingStars({ stars }: { stars: number }) {
  return stars < 1 || stars > 5 ? (
    <></>
  ) : (
    <div>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
        <FontAwesomeIcon
          icon={faStar}
          key={i}
          style={{
            color: i <= Math.round(stars) ? "gold" : "lightgray",
          }}
        />
      ))}
    </div>
  );
}
