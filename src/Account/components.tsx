import { useUser } from "./hooks";

export function IfAuthenticated({ children }: { children: React.ReactNode }) {
  const user = useUser();
  return user ? <>{children}</> : <></>;
}

export function IfUnauthenticated({ children }: { children: React.ReactNode }) {
  const user = useUser();
  return user ? <></> : <>{children}</>;
}

export function IfUser({ children }: { children: React.ReactNode }) {
  const user = useUser();
  return user && user.role === "user" ? <>{children}</> : <></>;
}

export function IfEditor({ children }: { children: React.ReactNode }) {
  const user = useUser();
  return user && user.role === "editor" ? <>{children}</> : <></>;
}
export {};
