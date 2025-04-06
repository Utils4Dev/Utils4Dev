import { Suspense } from "react";
import { CodeEditPage } from "./page";
import { CodeEditSkeleton } from "./skeleton";

export function CodeEdit() {
  return (
    <Suspense fallback={<CodeEditSkeleton />}>
      <CodeEditPage />
    </Suspense>
  );
}
