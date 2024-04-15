import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { IfAuthenticated, IfUnauthenticated } from "../Account/components";
import { useCurrentUser, useRefetchUser } from "../Account/hooks";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRightFromBracket,
  faRightToBracket,
  faSearch,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import usersClient from "../API/Users/client";

export default function NavigationLinks({ onClick }: { onClick?: () => void }) {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const refreshUser = useRefetchUser();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const redirectParams = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const currentPage = pathname.split("/")[1].toLowerCase();
  const redirectablePages = ["profile", "search", "details", "lists", "home"];
  const canRedirect = redirectablePages.includes(currentPage);
  const redirect = canRedirect
    ? `redirect=${encodeURIComponent(pathname.slice(1))}&${redirectParams}`
    : "";

  const logout = async () => {
    onClick && onClick();
    await usersClient.logout();
    await refreshUser();
    navigate("/login");
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
          <Link onClick={onClick} to="/home">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li className={pathname.includes("search") ? "active" : ""}>
          <Link onClick={onClick} to="/search">
            <FontAwesomeIcon icon={faSearch} />
            Search
          </Link>
        </li>
        <IfAuthenticated>
          <li
            className={
              pathname.includes("profile") &&
              currentUser &&
              pathname.split("/")[2] === currentUser._id
                ? "active"
                : ""
            }
          >
            <Link onClick={onClick} to="/profile">
              <FontAwesomeIcon icon={faUser} />
              Profile
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => logout()}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </Link>
          </li>
        </IfAuthenticated>
        <IfUnauthenticated>
          <li>
            <Link onClick={onClick} to={`/login?${redirect}`}>
              <FontAwesomeIcon icon={faRightToBracket} />
              Login
            </Link>
          </li>
          <li>
            <Link onClick={onClick} to={`/register?${redirect}`}>
              <FontAwesomeIcon icon={faUserPlus} />
              Register
            </Link>
          </li>
        </IfUnauthenticated>
      </ul>
    </div>
  );
}
