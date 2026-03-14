import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useBlogs(params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/blogs", { params });
        setData(res.data.data.blogs || res.data.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}
