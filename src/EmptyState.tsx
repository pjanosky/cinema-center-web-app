import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentUser } from "./Users/Hooks";

export default function EmptyStateGraphic({
  name,
  subtitle,
  icon,
  userId,
}: {
  name: string;
  subtitle?: string;
  icon: any;
  userId?: string;
}) {
  const currentUser = useCurrentUser();
  return (
    <div
      className="d-flex flex-column align-items-center text-center cc-secondary-1"
      style={{
        marginTop: "6rem",
        marginBottom: "6rem",
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: "3rem" }} />
      <h2>{name}</h2>
      {subtitle && (!userId || currentUser?._id === userId) && (
        <div>{subtitle}</div>
      )}
    </div>
  );
}
