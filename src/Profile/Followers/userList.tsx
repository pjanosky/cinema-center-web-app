import { FaChevronRight, FaUser } from "react-icons/fa";
import { User } from "../../types";
import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default function UserList({ users }: { users: User[] }) {
  return (
    <div className="cc-user-list">
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item">
            <Link to={`/profile/${user._id}`}>
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    borderRadius: "1.4em",
                    backgroundColor: "lightgray",
                  }}
                >
                  <FaUser
                    style={{
                      margin: "0.4em",
                      fontSize: "1.5em",
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  <span style={{ color: "black" }}>{user.name}</span>
                  <br />
                  <span style={{ color: "gray" }}>{user.username}</span>
                </div>
                <FaChevronRight />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
