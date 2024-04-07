import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { IfAuthenticated, IfUnauthenticated } from "../Account/components";
import { useUser, useRefreshUser } from "../Account/hooks";
import * as client from "../Account/client";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRightFromBracket,
  faRightToBracket,
  faSearch,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function NavigationLinks({ onClick }: { onClick?: () => void }) {
  const user = useUser();
  const navigate = useNavigate();
  const refreshUser = useRefreshUser();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const redirectParams = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const redirect = `redirect=${pathname}&${redirectParams}`;

  const logout = async () => {
    onClick && onClick();
    await client.logout();
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
          <Link onClick={onClick} to="home">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li className={pathname.includes("search") ? "active" : ""}>
          <Link onClick={onClick} to="search">
            <FontAwesomeIcon icon={faSearch} />
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
            <Link onClick={onClick} to={`login?${redirect}`}>
              <FontAwesomeIcon icon={faRightToBracket} />
              Login
            </Link>
          </li>
          <li>
            <Link onClick={onClick} to={`register?${redirect}`}>
              <FontAwesomeIcon icon={faUser} />
              Register
            </Link>
          </li>
        </IfUnauthenticated>
      </ul>
    </div>
  );
}
