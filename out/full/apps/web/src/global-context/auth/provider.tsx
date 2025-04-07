import { useLogout, useMe } from "@src/api/auth/auth";
import { PropsWithChildren } from "react";
import { AuthContext } from "./hook";
import { useQueryClient } from "@tanstack/react-query";

export function AuthContextProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    queryKey: meQueryKey,
  } = useMe({
    query: {
      retry: false,
    },
  });
  const user = data || null;

  const { refetch: logoutQuery } = useLogout({ query: { enabled: false } });

  async function logout() {
    await logoutQuery();
    await queryClient.resetQueries({ queryKey: meQueryKey, exact: true });
  }

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground flex items-center text-2xl">
          Verificando autenticação
          <span className="ml-1 inline-flex">
            <span className="mx-[1px] animate-bounce delay-0">.</span>
            <span className="mx-[1px] animate-bounce delay-100">.</span>
            <span className="mx-[1px] animate-bounce delay-200">.</span>
          </span>
        </p>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
