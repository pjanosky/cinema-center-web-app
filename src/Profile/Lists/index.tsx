import { User } from "../../types";

export default function Lists({ user }: { user: User }) {
  return (
    <div>
      <h2>Lists</h2>
      {`ID: ${user._id}`}
      {JSON.stringify(user)}
    </div>
  );
}
