import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@src/components/ui/card";
import { Skeleton } from "@src/components/ui/skeleton";

export function CodeCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        {/* Título do código */}
        <Skeleton className="h-6 w-[160px]" />

        {/* Badge de linguagem */}
        <Skeleton className="h-5 w-[70px] rounded-full" />
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          {/* Bloco de código */}
          <Skeleton className="h-[150px] w-full rounded-none" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between px-4 py-2">
        {/* Nome do autor */}
        <Skeleton className="h-4 w-[120px]" />
      </CardFooter>
    </Card>
  );
}
