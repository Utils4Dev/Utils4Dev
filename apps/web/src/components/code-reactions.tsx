import {
  getFindAllPublicCodesQueryKey,
  getFindCodeByIdQueryKey,
  getFindMyCodesQueryKey,
  useAddReactionToCodeById,
  useRemoveReactionToCodeById,
} from "@src/api/code/code";
import { CodeWithReactionsDtoReactions, ReactionType } from "@src/api/models";
import { Button } from "@src/components/ui/button";
import { useAuthContext } from "@src/global-context/auth/hook";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ReactionInfo = {
  icon: LucideIcon;
  color: string;
  name: string;
};

const REACTIONS: Record<ReactionType, ReactionInfo> = {
  [ReactionType.like]: {
    icon: ArrowUpIcon,
    color: "#00c950",
    name: "Like",
  },
  [ReactionType.dislike]: {
    icon: ArrowDownIcon,
    color: "#fb2c36",
    name: "Dislike",
  },
};

type CodeReactionProps = {
  codeId: string;
  reactions: CodeWithReactionsDtoReactions;
};

export function CodeReactions({
  codeId,
  reactions: reactions,
}: CodeReactionProps) {
  const { authenticatedUser } = useAuthContext();
  const [loadingReactionType, setLoadingReactionType] =
    useState<ReactionType | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: addReaction, isPending: isPendingAddReaction } =
    useAddReactionToCodeById();
  const { mutateAsync: removeReaction, isPending: isPendingRemoveReaction } =
    useRemoveReactionToCodeById();

  const isPending = isPendingAddReaction || isPendingRemoveReaction;

  async function handleReaction(type: ReactionType) {
    if (isPending) return;
    if (!authenticatedUser) return;

    setLoadingReactionType(type);

    if (reactions[type]?.userReacted) {
      try {
        await removeReaction({ id: codeId });

        invalidateQueries();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        toast.error("Erro ao remover reação");
      }
    } else {
      try {
        await addReaction({
          id: codeId,
          data: { type },
        });

        invalidateQueries();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        toast.error("Erro ao adicionar reação");
      }
    }

    setLoadingReactionType(null);
  }

  function invalidateQueries() {
    queryClient.invalidateQueries({
      queryKey: getFindAllPublicCodesQueryKey(),
    });

    queryClient.invalidateQueries({
      queryKey: getFindMyCodesQueryKey(),
    });

    queryClient.invalidateQueries({
      queryKey: getFindCodeByIdQueryKey(codeId),
    });
  }

  return (
    <div className="flex items-center gap-3">
      {Object.entries(REACTIONS).map(([type, { icon: Icon, color, name }]) => {
        const reactionType = type as ReactionType;
        const count = reactions[reactionType]?.length || 0;
        const userReacted = reactions[reactionType]?.userReacted || false;
        const isLoading = loadingReactionType === reactionType;
        const isDisabled = isPending || isLoading;

        return (
          <Button
            key={type}
            variant="ghost"
            title={name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleReaction(reactionType);
            }}
            disabled={isDisabled}
            className="h-min w-min gap-2 p-1"
          >
            <Icon
              style={{ color: userReacted ? color : undefined }}
              className="h-4 w-4"
            />

            <span className="text-center">{count}</span>
          </Button>
        );
      })}
    </div>
  );
}
