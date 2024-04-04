import {
  FaHome,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { IfAuthenticated, IfUnauthenticated } from "../Account/components";
import { useUser, useRefreshUser } from "../Account/hooks";
import * as client from "../Account/client";
import "./index.css";

export default function NavigationLinks({ onClick }: { onClick?: () => void }) {
  const user = useUser();
  const refreshUser = useRefreshUser();
  const { pathname } = useLocation();

  const logout = async () => {
    onClick && onClick();
    await client.logout();
    refreshUser();
  };

  return (
    <div className="cc-navigation">
      <ul>
        <li className="d-none d-md-block">
          <Link
            onClick={onClick}
            to="home"
            className="fw-bold"
            style={{ fontSize: "x-large" }}
          >
            Cinema Center
          </Link>
        </li>
        <li className={pathname.includes("home") ? "active" : ""}>
          <Link onClick={onClick} to="home">
            <FaHome /> Home
          </Link>
        </li>
        <li className={pathname.includes("search") ? "active" : ""}>
          <Link onClick={onClick} to="search">
            <FaSearch />
            Search
          </Link>
        </li>
        <IfAuthenticated>
          <li
            className={
              pathname.includes("profile") &&
              user &&
              pathname.split("/")[2] === user._id
                ? "active"
                : ""
            }
          >
            <Link onClick={onClick} to={`profile/${user?._id || ""}`}>
              <FaUser />
              Profile
            </Link>
          </li>
          <li>
            <Link to="home" onClick={() => logout()}>
              <FaSignOutAlt />
              Logout
            </Link>
          </li>
        </IfAuthenticated>
        <IfUnauthenticated>
          <li>
            <Link onClick={onClick} to="login">
              <FaSignInAlt />
              Login
            </Link>
          </li>
          <li>
            <Link onClick={onClick} to="register">
              <FaUser />
              Register
            </Link>
          </li>
        </IfUnauthenticated>
      </ul>
    </div>
  );
}
