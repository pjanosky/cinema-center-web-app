import { useState } from "react";

export default function Poster({ path }: { path: string }) {
  const API_BASE = process.env.REACT_APP_TMDB_IMAGE_API_BASE || "";
  const url = `${API_BASE}${path}`;
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-100 h-100">
      {path && (
        <img
          className="w-100 h-100"
          src={url}
          alt={"movie poster"}
          onLoad={(e) => setLoaded(true)}
        />
      )}
      {!loaded && (
        <div
          className="w-100 h-100"
          style={{ backgroundColor: "lightgray" }}
        ></div>
      )}
    </div>
  );
}
