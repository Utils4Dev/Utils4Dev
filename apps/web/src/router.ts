import { createBrowserRouter, Outlet } from "react-router";
import { DefaultLayout } from "./layouts/default";
import { CodeEdit } from "./pages/code/edit";
import { PublicCodeList } from "./pages/code/public";
import { PrivatePage } from "./pages/private-page";
import { Home } from "./pages/home";
import { CodeDetails } from "./pages/code/details";
import { MyCodeList } from "./pages/code/my-codes";
import { UsersDetails } from "./pages/users/details";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      // Public routes
      {
        path: "",
        Component: Outlet,
        children: [
          {
            path: "",
            Component: Home,
          },
          {
            path: "codes",
            Component: PublicCodeList,
          },
          {
            path: "codes/:codeId",
            Component: CodeDetails,
          },
          {
            path: "users/:userId",
            Component: UsersDetails,
          },
        ],
      },
      // Private routes
      {
        path: "",
        Component: PrivatePage,
        children: [
          {
            path: "codes/me",
            Component: MyCodeList,
          },
          {
            path: "codes/:codeId/edit",
            Component: CodeEdit,
          },
        ],
      },
    ],
  },
]);
