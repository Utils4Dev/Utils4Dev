import { cn } from "@src/lib/utils";
import { ComponentProps } from "react";
import { LoginButton } from "./login-button";
import { useAuthContext } from "@src/global-context/auth/hook";
import { UserInfo } from "./user-info";
import { Link } from "react-router";

type HeaderProps = Omit<ComponentProps<"header">, "children">;
export function Header({ className, ...props }: HeaderProps) {
  const { user, logout } = useAuthContext();

  return (
    <header className={cn("flex border-b p-3", className)} {...props}>
      <Link to="/">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Utils 4 Dev
        </h1>
      </Link>

      <div className="ml-auto flex items-center gap-3">
        {user ? <UserInfo user={user} onLogout={logout} /> : <LoginButton />}
      </div>
    </header>
  );
}
