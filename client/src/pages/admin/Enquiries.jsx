import { useEffect, useState } from "react";
import api from "../../utils/api";
import Skeleton from "../../components/ui/Skeleton";

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    const res = await api.get("/contact");
    setEnquiries(res.data.data.contacts || res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/contact/${id}/read`);
    fetchEnquiries();
  };

  const deleteEnquiry = async (id) => {
    await api.delete(`/contact/${id}`);
    setEnquiries((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-text-primary">Enquiries</h1>
      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-body-sm">
          <thead className="bg-surface-soft text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3" colSpan="6">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}
            {!loading &&
              enquiries.map((c) => (
                <tr key={c._id} className="border-t border-border">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.service}</td>
                  <td className="px-4 py-3">{c.message}</td>
                  <td className="px-4 py-3">{c.read ? "Read" : "Unread"}</td>
                  <td className="px-4 py-3 space-x-2">
                    {!c.read && (
                      <button onClick={() => markRead(c._id)} className="text-primary">
                        Mark read
                      </button>
                    )}
                    <button onClick={() => deleteEnquiry(c._id)} className="text-error">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
