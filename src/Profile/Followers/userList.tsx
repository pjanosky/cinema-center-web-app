import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../API/Users/types";
import "./index.css";

export default function UserList({ users }: { users: User[] }) {
  return (
    <div className="cc-user-list">
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item">
            <Link to={`/profile/${user._id}`} className="cc-link">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "lightgray",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{
                      margin: "0.4em",
                      fontSize: "1.5em",
                      aspectRatio: 1,
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  {user.name}
                  <br />
                  <span style={{ color: "gray" }}>@{user.username}</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
