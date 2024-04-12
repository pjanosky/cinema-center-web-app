import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../Account/hooks";
import "./index.css";
import { User } from "../../API/Users/types";
import { Dropdown, DropdownButton } from "react-bootstrap";

export default function ProfileNavigation({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserLinks =
    currentUser && currentUser._id === id ? ["Account"] : [];
  const links =
    user.role === "user"
      ? ["Reviews", "Likes", "Followers", "Following", ...currentUserLinks]
      : ["Lists", ...currentUserLinks];

  const activeLink = links.find((link) =>
    pathname.toLowerCase().includes(link.toLowerCase())
  );
  return (
    <div>
      <div className="cc-profile-nav d-none d-sm-block">
        <nav className="nav nav-underline">
          {links.map((link) => {
            return (
              <Link
                key={link}
                to={link}
                className={`nav-link ${link === activeLink ? "active" : ""}`}
              >
                {link}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="cc-profile-dropdown d-block d-sm-none">
        <DropdownButton
          title={activeLink || "Profile"}
          onSelect={(eventKey) => eventKey && navigate(eventKey)}
        >
          {links.map((link) => (
            <Dropdown.Item
              key={link}
              active={link === activeLink}
              eventKey={link}
            >
              {link}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
      <div style={{ paddingTop: "10px" }}>{children}</div>
    </div>
  );
}
