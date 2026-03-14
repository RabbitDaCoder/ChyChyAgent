import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useBlog(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${slug}`);
        setData(res.data.data || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  return { data, loading, error };
}
