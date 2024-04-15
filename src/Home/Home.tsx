import { IfUnauthenticated, IfUser, IfEditor } from "../Account/Components";
import EditorHome from "./EditorHome";
import UnauthenticatedHome from "./UnauthenticatedHome";
import UserHome from "./UserHome";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <IfUnauthenticated>
        <UnauthenticatedHome />
      </IfUnauthenticated>
      <IfUser>
        <UserHome />
      </IfUser>
      <IfEditor>
        <EditorHome />
      </IfEditor>
    </div>
  );
}
