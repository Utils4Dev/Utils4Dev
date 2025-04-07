import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthContextProvider } from "./global-context/auth/provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "./components/ui/sonner";

export function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}
