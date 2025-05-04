import { CodeWithReactionsAndBookMarkDto } from "@src/api/models";
import { CodeBookmark } from "@src/components/code-bookmark";
import { CodeReactions } from "@src/components/code-reactions";
import { SyntaxHighlighter } from "@src/components/syntax-highlighter";
import { Badge } from "@src/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { Languages } from "@src/constants/languages";
import { cn } from "@src/lib/utils";
import { isLightColor } from "@src/utils/is-light-color";

type CodeCardProps = {
  code: CodeWithReactionsAndBookMarkDto;
};

export function CodeCard({ code }: CodeCardProps) {
  const { name, color } = Languages[code.language];

  return (
    <Card className="max-w-[400px] min-w-[300px]">
      <CardHeader className="flex justify-between">
        <CardTitle>{code.name}</CardTitle>

        <Badge
          style={{ backgroundColor: color }}
          className={cn(isLightColor(color) ? "text-slate-900" : "text-white")}
        >
          {name}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <SyntaxHighlighter
          language={code.language}
          className="h-[150px] max-h-[150px] text-xs"
        >
          {code.content}
        </SyntaxHighlighter>
      </CardContent>

      <CardFooter className="text-muted-foreground flex justify-between px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span title={code.author.name} className="max-w-[120px] truncate">
            {code.author.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CodeBookmark codeId={code.id} isBookmarked={code.isBookmarked} />
          <CodeReactions codeId={code.id} reactions={code.reactions} />
        </div>
      </CardFooter>
    </Card>
  );
}
