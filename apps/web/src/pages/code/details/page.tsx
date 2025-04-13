import { useFindCodeByIdSuspense } from "@src/api/code/code";
import { CodeReactions } from "@src/components/code-reactions";
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
import { cn } from "@src/lib/utils";
import { downloadFile } from "@src/utils/download-file";
import { isLightColor } from "@src/utils/is-light-color";
import { kebabCase } from "@src/utils/kebab-case";
import { CalendarIcon, ClockIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useParams } from "react-router";
import { toast } from "sonner";
import { CommentsSection } from "@src/components/comments-section";

export function CodeDetailsPage() {
  const { codeId } = useParams();
  const { data: code } = useFindCodeByIdSuspense(codeId!);
  const languageInfo = Languages[code.language];

  function copyToClipboard() {
    navigator.clipboard.writeText(code.content);
    toast.success("Código copiado para a área de transferência");
  }

  function downloadCode() {
    // Usar a extensão do arquivo definida em Languages
    const filename = `${kebabCase(code.name || "codigo")}.${languageInfo.extension}`;

    // Criar um arquivo File com o conteúdo do código
    const file = new File([code.content], filename, { type: "text/plain" });

    // Usar o utilitário de download
    downloadFile(file);

    toast.success("Código baixado com sucesso");
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
              </div>
            </div>

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
