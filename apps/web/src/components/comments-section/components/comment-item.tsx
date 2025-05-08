import { CommentDto } from "@src/api/models";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { DateTime } from "luxon";

type CommentItemProps = {
  comment: CommentDto;
};

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="border-border bg-card/50 rounded-lg border p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={comment.author.avatarUrl ?? undefined}
            alt={comment.author.name}
          />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {comment.author.name}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex w-full items-start justify-between">
            <div className="font-medium">{comment.author.name}</div>
            {comment.createdAt && (
              <span className="text-muted-foreground text-xs">
                {DateTime.fromISO(comment.createdAt)
                  .setLocale("pt-BR")
                  .toRelative({ style: "long" })}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm break-words">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
