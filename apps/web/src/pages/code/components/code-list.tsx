import { cn } from "@src/lib/utils";
import { ComponentProps } from "react";

type CodeListProps = ComponentProps<"div">;
export function CodeList({ className, ...props }: CodeListProps) {
  return (
    <div
      className={cn(
        "container mx-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}
