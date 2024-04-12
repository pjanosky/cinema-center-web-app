export type Role = "user" | "editor";

export type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  following: string[];
};

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
};
