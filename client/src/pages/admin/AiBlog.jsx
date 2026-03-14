import { useState } from "react";
import api from "../../utils/api";
import { FaRegCopy, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { prompts } from "../../utils/admin/data";
import Button from "../../components/ui/Button";

const AiBlog = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [blogIdeas, setBlogIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Remove markdown formatting for clipboard
  const removeMarkdown = (text) =>
    text
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      .replace(/~~(.*?)~~/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/#+\s?/g, "")
      .replace(/>\s?/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/[-*]\s+/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

  // Generate AI blog content
  const generateBlogContent = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setGeneratedContent("");
    try {
      const response = await api.post("/ai/generate-post", { topic: prompt });
      let content = "";
      if (response.data?.content) content = response.data.content;
      else if (response.data?.text) content = response.data.text;
      else if (Array.isArray(response.data) && response.data.length > 0)
        content = response.data[0];
      else content = "No content generated. Please try again.";
      setGeneratedContent(content);
    } catch (err) {
      console.error("Error generating blog content:", err);
      setError("Failed to generate blog content. Please try again.");
    }
    setLoading(false);
  };

  // Generate AI blog ideas
  const generateBlogIdeas = async () => {
    setLoadingIdeas(true);
    setError("");
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    try {
      const response = await api.post("/ai/suggest-titles", {
        topic: randomPrompt,
      });
      setBlogIdeas(response.data.ideas || []);
    } catch (err) {
      console.error("Error fetching blog ideas:", err);
      setError("Failed to fetch blog ideas.");
    }
    setLoadingIdeas(false);
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    const plainText = removeMarkdown(text);
    navigator.clipboard
      .writeText(plainText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => setCopied(false));
  };

  // Close blog ideas
  const handleCloseIdeas = () => setBlogIdeas([]);

  // Close generated content
  const handleCloseGenerated = () => setGeneratedContent("");

  return (
    <div className="w-full h-full min-h-dvh dark:text-white dark:bg-gray-900">
      <div className="max-w-3xl lg:mx-auto p-3 lg:p-6">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <Button variant="secondary" onClick={generateBlogIdeas} disabled={loadingIdeas} className="mb-4">
          {loadingIdeas ? "Fetching Ideas..." : "Get Blog Ideas"}
        </Button>

        {blogIdeas.length > 0 && (
          <div className="mb-4 relative">
            <button
              onClick={handleCloseIdeas}
              className="absolute right-0 top-0 text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2"
              title="Close"
            >
              <FaTimes size={18} />
            </button>
            <ul>
              {blogIdeas.map((idea, idx) => (
                <li
                  key={idx}
                  className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mb-2 prose dark:prose-invert"
                >
                  <ReactMarkdown>{idea.trim()}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a blog topic..."
            className="flex-grow p-3 border rounded-md dark:text-white dark:bg-gray-700"
          />
          <Button variant="primary" onClick={generateBlogContent} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>

        {generatedContent && (
          <div className="mt-6 p-4 border rounded-md bg-white dark:bg-gray-800 shadow relative">
            <button
              onClick={handleCloseGenerated}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2"
              title="Close"
            >
              <FaTimes size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-2">AI Blog Content</h3>
            <div className="prose dark:prose-invert">
              <ReactMarkdown>{generatedContent}</ReactMarkdown>
            </div>
            <button
              onClick={() => handleCopy(generatedContent)}
              className="mt-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center"
            >
              <FaRegCopy size={18} className="mr-2" />
              {copied ? "Copied!" : "Copy Content"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiBlog;
