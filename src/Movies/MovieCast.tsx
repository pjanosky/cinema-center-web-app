import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Movie } from "../API/Movies/types";
import MoviePoster from "./MoviePoster";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function MovieCast({ details }: { details: Movie }) {
  return (
    <div className="d-flex flex-wrap gap-3">
      {details.cast.map((member) => (
        <div
          key={member.id}
          style={{
            width: "100px",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <div style={{ width: "100px", height: "150px", margin: "auto" }}>
              <MoviePoster size="w185" path={member.profile_path}>
                <div
                  className="d-flex align-items-center justify-content-center cc-bg-secondary-2"
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="cc-secondary-1"
                    style={{ fontSize: "2.5rem" }}
                  />
                </div>
              </MoviePoster>
            </div>
          </div>
          {member.name}
        </div>
      ))}
    </div>
  );
}
