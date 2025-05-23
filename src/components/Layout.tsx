import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <Toaster richColors position="top-right" />
    </div>
  );
}
