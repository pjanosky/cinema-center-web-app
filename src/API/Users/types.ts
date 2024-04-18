export type Role = "user" | "editor";

export type WatcherUser = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: "user";
  following: string[];
};

export type EditorUser = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: "editor";
  bio: string;
};

export type User = WatcherUser | EditorUser;

export function isEditorUser(user: User): user is EditorUser {
  return (user as EditorUser).role === "editor";
}

export function isWatcherUser(user: User): user is WatcherUser {
  return (user as WatcherUser).role === "user";
}

export type NewUser = {
  username: string;
  password: string;
  name: string;
  email: string;
  role: Role;
};

export type UpdateUser = {
  _id: string;
  username: string;
  name: string;
  email: string;
  bio: string;
};
