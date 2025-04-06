import { UserDto } from "@src/api/models";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Button } from "@src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { cn } from "@src/lib/utils";
import { ChevronDownIcon, CodeIcon, LogOutIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";

type UserInfoProps = {
  user: UserDto;
  onLogout?: () => void;
  className?: string;
};

export function UserInfo({ user, onLogout, className }: UserInfoProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group" asChild>
        <Button
          variant="ghost"
          className={cn("w-min items-center rounded-full p-1", className)}
        >
          <Avatar>
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>

          <ChevronDownIcon className="transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <UserIcon />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={`/codes/me`}>
            <CodeIcon />
            <span>Meus códigos</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout}>
          <LogOutIcon />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
