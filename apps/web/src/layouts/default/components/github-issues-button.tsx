import { Button } from "@src/components/ui/button";
import { BugIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@src/components/ui/tooltip";
import { cn } from "@src/lib/utils";

// URL do repositório GitHub do projeto - ajuste para o seu repositório específico
const GITHUB_ISSUES_URL =
  "https://github.com/Utils4Dev/Utils4Dev/issues/new";

type GithubIssuesButtonProps = {
  className?: string;
  fixed?: boolean;
};

export function GithubIssuesButton({ className }: GithubIssuesButtonProps) {
  function handleClick() {
    window.open(GITHUB_ISSUES_URL, "_blank");
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant="outline"
            className={cn("bg-background", className)}
          >
            <BugIcon className="h-4 w-4" />
            <span>Bugs e Features</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Bugs e Features</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
