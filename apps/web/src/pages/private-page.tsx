import { Private } from "@src/components/private";
import { Outlet } from "react-router";

export function PrivatePage() {
  return (
    <Private fallback={<Fallback />}>
      <Outlet />
    </Private>
  );
}

function Fallback() {
  return <div>Você não tem permissão para acessar essa página</div>;
}
