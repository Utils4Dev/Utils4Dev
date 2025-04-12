import { useAuthContext } from "@src/global-context/auth/hook";
import { PropsWithChildren, ReactNode } from "react";

type PrivateProps = {
  fallback?: ReactNode;
};

export function Private({
  fallback,
  children,
}: PropsWithChildren<PrivateProps>) {
  const { authenticatedUser } = useAuthContext();

  if (!authenticatedUser) return <>{fallback}</>;
  else return <>{children}</>;
}
