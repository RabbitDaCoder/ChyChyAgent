import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Edit3,
  Sparkles,
  Home,
  Shield,
  Mail,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "../ui/Button";
import api from "../../utils/api";

const baseNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/admin/blogs", label: "Blog Posts", icon: Edit3 },
  { to: "/admin/ai-blog", label: "AI Writer", icon: Sparkles },
  { to: "/admin/listings", label: "Listings", icon: Home },
  { to: "/admin/insurance", label: "Insurance", icon: Shield },
  { to: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const superAdminNavItems = [
  { to: "/admin/manage-admins", label: "Manage Admins", icon: Users },
];

export default function Sidebar({ onLogout, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    let timer;
    const fetchCount = async () => {
      try {
        const { data } = await api.get("/blogs", {
          params: { status: "draft", aiGenerated: true, limit: 1 },
        });
        setDraftCount(data.data?.total || 0);
      } catch (err) {
        setDraftCount(0);
      }
      timer = setTimeout(fetchCount, 5 * 60 * 1000);
    };
    fetchCount();
    return () => clearTimeout(timer);
  }, []);

  const navItems = baseNavItems.map((item) => {
    if (item.to === "/admin/blogs") {
      return { ...item, badge: draftCount > 0 ? draftCount : null };
    }
    return item;
  });

  // Add super admin items if user is superadmin
  const allNavItems =
    user?.role === "superadmin"
      ? [...navItems, ...superAdminNavItems]
      : navItems;

  return (
    <aside
      className={`bg-text-primary text-white transition-all duration-200 ${
        collapsed ? "w-20" : "w-60"
      } min-h-screen sticky top-0 flex flex-col border-r border-primary-dark`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl">ChyChy</span>
          {!collapsed && <span className="text-white/70 text-sm">Admin</span>}
        </div>
        <button
          onClick={() => setCollapsed((p) => !p)}
          aria-label="Toggle sidebar"
          className="text-white/60"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {allNavItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-white/80 hover:bg-white/10"
              }`
            }
          >
            <Icon size={18} />
            {!collapsed && (
              <span className="flex items-center gap-2">
                {label}
                {badge ? (
                  <span className="rounded-pill bg-primary-light px-2 py-0.5 text-[10px] text-text-primary">
                    {badge}
                  </span>
                ) : null}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-4">
        {!collapsed && user && (
          <div className="mb-3 rounded-lg bg-white/10 px-3 py-3 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {(user.name || "A")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="font-semibold leading-tight">
                  {user.name || "Admin"}
                </p>
                <p className="text-[10px] text-white/60">
                  {user.role || "Admin"} — ChyChyAgent
                </p>
              </div>
            </div>
            <p className="text-white/50 text-[11px] truncate">
              {user.email || ""}
            </p>
          </div>
        )}
        <Button
          variant="secondary"
          className="w-full"
          onClick={onLogout}
          as="button"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  onLogout: PropTypes.func,
  user: PropTypes.object,
};
