import {
  faHome,
  faSearch,
  faUser,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "react-router";
import { useSearchParams, Link } from "react-router-dom";
import usersClient from "../API/Users/client";
import { IfAuthenticated, IfUnauthenticated } from "../Users/Components";
import { useCurrentUser, useRefetchUser } from "../Users/Hooks";

export default function NavigationLinks({ onClick }: { onClick?: () => void }) {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const refetchUser = useRefetchUser();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const redirectParams = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const currentPage = pathname.split("/")[1].toLowerCase();
  const redirectablePages = [
    "profile",
    "search",
    "details",
    "lists",
    "home",
    "profile",
  ];
  const canRedirect = redirectablePages.includes(currentPage);
  const redirect = canRedirect
    ? `redirect=${encodeURIComponent(pathname.slice(1))}&${redirectParams}`
    : "";

  const logout = async () => {
    onClick && onClick();
    await usersClient.logout();
    await refetchUser();
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
              <div
                className="lh-sm d-flex flex-column justify-content-center"
                style={{ height: "1rem" }}
              >
                <div>Profile</div>
                {currentUser && (
                  <div className="small" style={{}}>
                    {currentUser.name}
                  </div>
                )}
              </div>
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
