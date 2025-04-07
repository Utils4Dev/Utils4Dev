import { Suspense } from "react";
import { CodeDetailsSkeleton } from "./skeleton";
import { CodeDetailsPage } from "./page";

export function CodeDetails() {
  return (
    <Suspense fallback={<CodeDetailsSkeleton />}>
      <CodeDetailsPage />
    </Suspense>
  );
}
