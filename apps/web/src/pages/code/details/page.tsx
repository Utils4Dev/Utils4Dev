import { useFindCodeByIdSuspense } from "@src/api/code/code";
import { CodeBookmark } from "@src/components/code-bookmark";
import { CodeReactions } from "@src/components/code-reactions";
import { CommentsSection } from "@src/components/comments-section";
import { SyntaxHighlighter } from "@src/components/syntax-highlighter";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { Languages } from "@src/constants/languages";
import { useAuthContext } from "@src/global-context/auth/hook";
import { cn } from "@src/lib/utils";
import { downloadFile } from "@src/utils/download-file";
import { isLightColor } from "@src/utils/is-light-color";
import { kebabCase } from "@src/utils/kebab-case";
import {
  CalendarIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  TagIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function CodeDetailsPage() {
  const { codeId } = useParams();
  const navigate = useNavigate();
  const user = useAuthContext();
  const { data: code } = useFindCodeByIdSuspense(codeId!);

  // Convertemos CodeDto para ExtendedCodeDto para acessar os campos keywords e description

  const languageInfo = Languages[code.language];
  const isOwner = user.authenticatedUser?.id === code.author.id;

  function copyToClipboard() {
    navigator.clipboard.writeText(code.content);
    toast.success("Código copiado para a área de transferência");
  }

  function downloadCode() {
    const filename = `${kebabCase(code.name || "codigo")}.${languageInfo.extension}`;
    const file = new File([code.content], filename, { type: "text/plain" });
    downloadFile(file);
    toast.success("Código baixado com sucesso");
  }

  function handleEdit() {
    navigate(`/codes/${codeId}/edit`);
  }

  function formatRelativeTime(dateString: string) {
    return DateTime.fromISO(dateString).setLocale("pt-BR").toRelative();
  }

  return (
    <div className="container mx-auto space-y-4 py-8">
      <Card className="border pb-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {code.name || "Código sem título"}
              </CardTitle>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                  title="Copiar código"
                >
                  <CopyIcon className="h-4 w-4" />
                  <span>Copiar</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadCode}
                  className="flex items-center gap-1"
                  title="Baixar código"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                {isOwner && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEdit}
                    className="flex items-center gap-1"
                    title="Editar código"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Editar</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                style={{ backgroundColor: languageInfo.color }}
                className={cn(
                  "px-3 py-1",
                  isLightColor(languageInfo.color)
                    ? "text-slate-900"
                    : "text-white",
                )}
              >
                {languageInfo.name}
              </Badge>

              {code.keywords &&
                code.keywords.length > 0 &&
                code.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    <TagIcon className="h-3 w-3" />
                    {keyword}
                  </Badge>
                ))}
            </div>

            {code.description && (
              <div className="text-muted-foreground border-muted-foreground/20 bg-muted/20 mt-2 rounded border-l-4 py-2 pl-4 text-sm">
                {code.description}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md bg-slate-950">
            <SyntaxHighlighter language={code.language} className="rounded-md">
              {code.content}
            </SyntaxHighlighter>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 flex flex-wrap items-center justify-between gap-4 border-t px-6 py-6">
          <div className="flex items-center space-x-4">
            <CodeBookmark codeId={code.id} isBookmarked={code.isBookmarked} />

            <CodeReactions codeId={codeId!} reactions={code.reactions} />

            {code.createdAt && (
              <div className="text-muted-foreground flex items-center text-sm">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>Criado: {formatRelativeTime(code.createdAt)}</span>
              </div>
            )}
            {code.updatedAt && (
              <div className="text-muted-foreground flex items-center text-sm">
                <ClockIcon className="mr-1 h-3 w-3" />
                <span>Atualizado: {formatRelativeTime(code.updatedAt)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={code.author.avatarUrl ?? undefined}
                alt={code.author.name || "Usuário"}
              />
              <AvatarFallback>
                {code.author?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm">
              {code.author?.name || "Usuário desconhecido"}
            </span>
          </div>
        </CardFooter>
      </Card>

      <CommentsSection codeId={code.id} />
    </div>
  );
}
