import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentUser } from "./Users/Hooks";

export default function EmptyStateGraphic({
  name,
  subtitle,
  icon,
  userId,
  includeNo = true,
}: {
  name: string;
  subtitle?: string;
  icon: any;
  userId?: string;
  includeNo?: boolean;
}) {
  const currentUser = useCurrentUser();
  return (
    <div
      className="d-flex flex-column align-items-center text-center"
      style={{
        color: "var(--secondary-1)",
        marginTop: "6rem",
        marginBottom: "6rem",
      }}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: "3rem" }} />
      <h2>
        {includeNo ? "No " : ""}
        {name}
      </h2>
      {subtitle && (!userId || currentUser?._id === userId) && (
        <div>{subtitle}</div>
      )}
    </div>
  );
}
