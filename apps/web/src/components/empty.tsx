import { cn } from "@src/lib/utils";

type EmptyProps = {
  message?: string;
  className?: string;
};

export function Empty({
  message = "Nenhum item encontrado",
  className,
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      <p className="text-lg text-gray-500">{message}</p>
    </div>
  );
}
