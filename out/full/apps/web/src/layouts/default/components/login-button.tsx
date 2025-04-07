import { GithubIcon } from "@src/components/icons/github";
import { Button } from "@src/components/ui/button";

const { VITE_BACKEND_URL } = import.meta.env;
const GITHUB_LOGIN_URL = `${VITE_BACKEND_URL}/auth/github/login`;

type LoginButtonProps = { className?: string };
export function LoginButton({ className }: LoginButtonProps) {
  function handleClick() {
    window.location.href = GITHUB_LOGIN_URL;
  }

  return (
    <Button onClick={handleClick} className={className}>
      Entrar com Github <GithubIcon />
    </Button>
  );
}
