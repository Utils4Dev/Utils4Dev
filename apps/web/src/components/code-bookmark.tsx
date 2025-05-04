import {
  useAddBookmarkByCodeId,
  useRemoveBookmarkByCodeId,
} from "@src/api/code/code";
import { useAuthContext } from "@src/global-context/auth/hook";
import { cn } from "@src/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type CodeBookmarkProps = {
  codeId: string;
  isBookmarked: boolean;
};

export function CodeBookmark({ codeId, isBookmarked }: CodeBookmarkProps) {
  const { authenticatedUser } = useAuthContext();

  const queryClient = useQueryClient();
  const { mutateAsync: addBookmark, isPending: isPendingAddBookmark } =
    useAddBookmarkByCodeId();
  const { mutateAsync: removeBookmark, isPending: isPendingRemoveBookmark } =
    useRemoveBookmarkByCodeId();

  const isPending = isPendingAddBookmark || isPendingRemoveBookmark;
  const isDisabled = !authenticatedUser || isPending;

  async function handleBookmark() {
    if (!authenticatedUser || isPending) return;

    try {
      if (isBookmarked) {
        await removeBookmark({ id: codeId });
        toast.success("Removido dos favoritos");
      } else {
        await addBookmark({ id: codeId });
        toast.success("Adicionado aos favoritos");
      }
      queryClient.invalidateQueries({
        queryKey: ["codes"],
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Erro ao atualizar favorito");
    }
  }

  return (
    <Button
      variant="ghost"
      title={isBookmarked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleBookmark();
      }}
      disabled={isDisabled}
      className="h-min w-min gap-2 p-1"
    >
      <BookmarkIcon
        className={cn("h-4 w-4", isBookmarked && "text-yellow-500")}
        fill={isBookmarked ? "currentColor" : "none"}
      />
    </Button>
  );
}
