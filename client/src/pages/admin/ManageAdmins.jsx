import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserPlus, Trash2, Ban, CheckCircle, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import { useUserStore } from "../../stores/useUserStore";
import { Navigate } from "react-router-dom";

export default function ManageAdmins() {
  const { user } = useUserStore();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminBlogs, setAdminBlogs] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);

  if (user?.role !== "superadmin")
    return <Navigate to="/admin/dashboard" replace />;

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admins");
      setAdmins(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }
    setCreating(true);
    try {
      await api.post("/admins", form);
      toast.success("Admin created successfully");
      setForm({ name: "", email: "", password: "" });
      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  const handleSuspend = async (id) => {
    try {
      const { data } = await api.patch(`/admins/${id}/suspend`);
      toast.success(
        data.data.suspended ? "Admin suspended" : "Admin reactivated",
      );
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await api.delete(`/admins/${id}`);
      toast.success("Admin deleted");
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const viewBlogs = async (admin) => {
    setSelectedAdmin(admin);
    try {
      const { data } = await api.get(`/admins/${admin._id}/blogs`);
      setAdminBlogs(data.data || []);
    } catch {
      setAdminBlogs([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-sm text-text-primary">
            Manage Admins
          </h1>
          <p className="text-body-sm text-text-muted">
            Create, suspend, or remove admin accounts
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          <UserPlus size={16} />
          Add Admin
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-text-muted">
          Loading admins...
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-10 text-text-muted">No admins found</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-soft text-text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Blogs</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-surface-soft/50">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <img
                      src={admin.image}
                      alt={admin.name}
                      className="h-8 w-8 rounded-full object-cover border border-border"
                    />
                    {admin.name}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{admin.email}</td>
                  <td className="px-4 py-3">{admin.blogCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        admin.suspended
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {admin.suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => viewBlogs(admin)}
                        className="rounded-md p-1.5 text-text-muted hover:bg-primary/10 hover:text-primary"
                        title="View blogs"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleSuspend(admin._id)}
                        className={`rounded-md p-1.5 ${
                          admin.suspended
                            ? "text-green-600 hover:bg-green-50"
                            : "text-amber-600 hover:bg-amber-50"
                        }`}
                        title={admin.suspended ? "Reactivate" : "Suspend"}
                      >
                        {admin.suspended ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Ban size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                        title="Delete admin"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View admin blogs panel */}
      <AnimatePresence>
        {selectedAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">
                Blogs by {selectedAdmin.name}
              </h3>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="text-text-muted hover:text-text-primary text-sm"
              >
                Close
              </button>
            </div>
            {adminBlogs.length === 0 ? (
              <p className="text-text-muted text-sm">No blogs yet</p>
            ) : (
              <ul className="space-y-2">
                {adminBlogs.map((blog) => (
                  <li
                    key={blog._id}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-2"
                  >
                    <span className="text-sm">{blog.title}</span>
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 ${
                        blog.status === "published"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create admin modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl border border-border"
            >
              <h2 className="font-display text-lg text-text-primary mb-4">
                Create New Admin
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    minLength={6}
                    required
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:bg-surface-soft"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create Admin"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
