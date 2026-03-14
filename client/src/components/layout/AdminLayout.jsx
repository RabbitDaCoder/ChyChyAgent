import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import Toast from "../ui/Toast";
import { useUserStore } from "../../stores/useUserStore";

export default function AdminLayout() {
  const { user, logout } = useUserStore();

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar onLogout={logout} user={user} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4 sticky top-0 z-40">
          <div className="flex flex-col">
            <span className="text-label text-text-muted uppercase tracking-wide">
              Admin Panel
            </span>
            <h1 className="font-display text-display-md text-primary mb-0">
              {user?.name || "Welcome back"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative rounded-full border border-border p-2 hover:bg-surface-soft"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary"></span>
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
              <img
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Admin"
                  )}&background=random&color=ffffff&bold=true&size=128`
                }
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
        <Toast />
      </div>
    </div>
  );
}
