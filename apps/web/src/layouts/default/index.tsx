import { Outlet } from "react-router";
import { Header } from "./components/header";
import { GithubIssuesButton } from "./components/github-issues-button";

export function DefaultLayout() {
  return (
    <div className="mx-auto flex h-screen flex-col gap-2">
      <Header />
      <div className="flex flex-1 flex-col px-3 pb-3">
        <Outlet />
      </div>
      <GithubIssuesButton className="fixed right-4 bottom-4 z-50" />
    </div>
  );
}
