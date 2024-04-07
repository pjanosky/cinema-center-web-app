import { Link, useLocation, useParams } from "react-router-dom";
import { useUser } from "../../Account/hooks";
import "./index.css";
import { User } from "../../types";

export default function ProfileNavigation({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const currentUser = useUser();
  const { id } = useParams();
  const currentUserLinks =
    currentUser && currentUser._id === id ? ["Account"] : [];

  const links =
    user.role === "user"
      ? ["Reviews", "Likes", "Followers", "Following", ...currentUserLinks]
      : ["Lists", ...currentUserLinks];

  return (
    <div className="cc-profile-nav">
      <nav className="nav nav-underline">
        {links.map((link) => {
          let active = pathname.includes(link.toLowerCase());
          return (
            <Link
              key={link}
              to={link.toLowerCase()}
              className={`nav-link ${active ? "active" : ""}`}
            >
              {link}
            </Link>
          );
        })}
      </nav>
      <div style={{ paddingTop: "10px" }}>{children}</div>
    </div>
  );
}
