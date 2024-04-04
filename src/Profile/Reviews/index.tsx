import { User } from "../../types";

export default function Reviews({ user }: { user: User }) {
  return (
    <div>
      <h2>Reviews</h2>
      {`ID: ${user._id}`}
      {JSON.stringify(user)}
    </div>
  );
}
