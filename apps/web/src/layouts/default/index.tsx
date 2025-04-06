import { Outlet } from "react-router";
import { Header } from "./components/header";

export function DefaultLayout() {
  return (
    <div className="mx-auto flex h-screen flex-col gap-2">
      <Header />
      <div className="flex flex-1 flex-col px-3 pb-3">
        <Outlet />
      </div>
    </div>
  );
}
