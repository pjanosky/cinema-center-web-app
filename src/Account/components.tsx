import { useCurrentUser } from "./hooks";

export function IfAuthenticated({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  return user ? <>{children}</> : <></>;
}

export function IfUnauthenticated({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  return user ? <></> : <>{children}</>;
}

export function IfMatchingUser({
  userId,
  children,
}: {
  userId: string | undefined;
  children: React.ReactNode;
}) {
  const currentUser = useCurrentUser();
  return currentUser && currentUser._id === userId ? <>{children}</> : <></>;
}

export function IfUser({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  return user && user.role === "user" ? <>{children}</> : <></>;
}

export function IfEditor({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  return user && user.role === "editor" ? <>{children}</> : <></>;
}

export function IfNotUser({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  return !user || user.role !== "user" ? <>{children}</> : <></>;
}

export function IfNotEditor({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  return !user || user.role !== "editor" ? <>{children}</> : <></>;
}
export {};
