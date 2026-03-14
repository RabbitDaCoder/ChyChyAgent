import { useState, useCallback } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export function useAIBlog() {
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = useCallback(async (promptData) => {
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await api.post("/ai/generate-blog", promptData);
      setResult(data.data);
      const history = JSON.parse(localStorage.getItem("chychyagent_ai_history") || "[]");
      const newEntry = { topic: promptData.topic, timestamp: new Date().toISOString() };
      const updated = [newEntry, ...history].slice(0, 5);
      localStorage.setItem("chychyagent_ai_history", JSON.stringify(updated));
      return data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Generation failed. Try again.";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  const saveAsDraft = useCallback(async (blogData) => {
    setSaving(true);
    try {
      const { data } = await api.post("/ai/save-draft", blogData);
      toast.success("Saved as draft!");
      return data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to save draft.";
      toast.error(msg);
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const publishDirectly = useCallback(async (blogData) => {
    setPublishing(true);
    try {
      const { data } = await api.post("/ai/publish-directly", blogData);
      toast.success("Blog published!");
      return data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to publish.";
      toast.error(msg);
      return null;
    } finally {
      setPublishing(false);
    }
  }, []);

  return {
    generate,
    saveAsDraft,
    publishDirectly,
    generating,
    saving,
    publishing,
    result,
    error,
    clearResult: () => setResult(null),
  };
}
