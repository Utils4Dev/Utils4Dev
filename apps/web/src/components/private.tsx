import { useAuthContext } from "@src/global-context/auth/hook";
import { PropsWithChildren, ReactNode } from "react";

type PrivateProps = {
  fallback?: ReactNode;
};

export function Private({
  fallback,
  children,
}: PropsWithChildren<PrivateProps>) {
  const { user } = useAuthContext();

  if (!user) return <>{fallback}</>;
  else return <>{children}</>;
}
