import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Save,
  Send,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";
import { useAIBlog } from "../../hooks/useAIBlog";
import toast from "react-hot-toast";

const statusConfig = {
  idle: { color: "bg-text-light", label: "Ready to generate" },
  loading: { color: "bg-warning", label: "Generating your post..." },
  success: { color: "bg-success", label: "Post generated" },
  error: { color: "bg-error", label: "Generation failed" },
};

export default function AIBlogGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState(800);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("preview");
  const [confirmPublish, setConfirmPublish] = useState(false);

  const { generate, saveAsDraft, publishDirectly, generating, saving, publishing, result, error } =
    useAIBlog();

  const status = generating ? "loading" : result ? "success" : error ? "error" : "idle";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chychyagent_ai_history") || "[]");
    setHistory(saved);
  }, []);

  const handleGenerate = async () => {
    await generate({
      topic,
      tone: toneLabel(tone),
      targetAudience: targetAudience || undefined,
      keywords: keywords
        ? keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : [],
      wordCount: length,
    });
  };

  const copyText = async (text, label = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Unable to copy");
    }
  };

  const renderPreview = () => {
    if (generating) return <LoadingPreview />;
    if (!result)
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-text-muted">
          <FileText size={48} className="opacity-30" />
          <p className="font-semibold text-text-primary">Your post will appear here</p>
          <p className="text-body-sm text-text-light">Fill in the prompt and click Generate</p>
        </div>
      );

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-text-primary line-clamp-1">{result.title}</h3>
          <span className="rounded-pill bg-accent-soft px-3 py-1 text-label font-mono text-primary">
            AI Generated
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-label text-text-muted">
          {result.category && (
            <span className="rounded-pill bg-surface-soft px-2 py-1">{result.category}</span>
          )}
          {result.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-pill bg-surface-soft px-2 py-1">
              {tag}
            </span>
          ))}
          {result.readTime && <span>{result.readTime} min read</span>}
          {result.wordCount && <span>{result.wordCount} words</span>}
        </div>

        <div className="flex gap-3 border-b border-border text-body-sm text-text-muted">
          <button
            className={`pb-2 ${activeTab === "preview" ? "text-primary border-b-2 border-primary" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
          <button
            className={`pb-2 ${activeTab === "html" ? "text-primary border-b-2 border-primary" : ""}`}
            onClick={() => setActiveTab("html")}
          >
            Raw HTML
          </button>
        </div>

        {activeTab === "preview" ? (
          <div
            className="prose prose-sm max-w-none max-h-[500px] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: result.content }}
          />
        ) : (
          <pre className="max-h-[500px] overflow-auto rounded-lg bg-surface-soft p-4 text-xs text-text-primary">
            <code>{result.content}</code>
          </pre>
        )}

        <details className="rounded-lg border border-border bg-surface-soft p-3">
          <summary className="cursor-pointer text-body-sm font-medium text-text-primary">
            SEO Details
          </summary>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={result.seoTitle}
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              />
              <Button variant="ghost" size="sm" onClick={() => copyText(result.seoTitle)}>
                <Copy size={14} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={result.seoDesc}
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              />
              <Button variant="ghost" size="sm" onClick={() => copyText(result.seoDesc)}>
                <Copy size={14} />
              </Button>
            </div>
          </div>
        </details>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-label text-text-muted">
            <span>Excerpt / Summary</span>
            <Button variant="ghost" size="sm" onClick={() => copyText(result.excerpt)}>
              <Copy size={14} />
            </Button>
          </div>
          <textarea
            readOnly
            value={result.excerpt}
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-text-primary"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <ActionButton
            label="Copy Content"
            icon={Copy}
            onClick={() => copyText(result.content, "Content copied to clipboard")}
          />
          <ActionButton
            label={saving ? "Saving..." : "Save as Draft"}
            icon={SavingIcon(saving)}
            disabled={saving}
            onClick={() => saveAsDraft(result)}
            variant="secondary"
          />
          <ActionButton
            label={publishing ? "Publishing..." : "Publish Now"}
            icon={Send}
            disabled={publishing}
            onClick={() => setConfirmPublish(true)}
          />
        </div>

        {result && (
          <button
            type="button"
            className="flex items-center gap-2 text-label text-text-muted underline"
            onClick={handleGenerate}
            disabled={generating}
          >
            <RefreshCw size={14} />
            Not happy? Generate again
          </button>
        )}

        {confirmPublish && (
          <div className="rounded-lg border border-border bg-surface-soft p-4">
            <p className="text-body-md text-text-primary">
              Publish this post immediately? It will be visible to all visitors.
            </p>
            <div className="mt-3 flex gap-3">
              <Button
                onClick={async () => {
                  const published = await publishDirectly(result);
                  if (published?.slug) {
                    toast.success("Published! View it on your blog.");
                  }
                  setConfirmPublish(false);
                }}
              >
                Yes, Publish
              </Button>
              <Button variant="ghost" onClick={() => setConfirmPublish(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="space-y-2">
          <p className="text-label font-mono uppercase tracking-wide text-primary">AI Blog Writer</p>
          <h1 className="font-display text-display-md text-text-primary">
            Describe what you want to write about and the AI will create a full post.
          </h1>
        </div>

        <label className="flex flex-col gap-2 text-label text-text-muted">
          <span className="font-medium">What should the blog be about?</span>
          <textarea
            rows={4}
            maxLength={500}
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Tips for first-time home buyers in Lagos — what to check before signing any papers"
            className="rounded-lg border border-border bg-surface px-3 py-3 text-body-md text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
          <span className="self-end text-label text-text-light">{topic.length}/500</span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-label text-text-muted">
            <span className="font-medium">Tone</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-3 text-body-md text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
            >
              <option value="professional">Professional & Trustworthy</option>
              <option value="friendly">Friendly & Conversational</option>
              <option value="educational">Educational & Informative</option>
              <option value="inspirational">Inspirational & Motivating</option>
            </select>
          </label>
          <Input
            label="Target Audience (optional)"
            placeholder="e.g. Lagos landlords, young couples, small business owners"
            maxLength={100}
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>

        <Input
          label="SEO Keywords (optional, comma separated)"
          helperText="These will be naturally included in the post"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. Lagos properties, buy house Lagos, real estate investment Nigeria"
        />

        <div className="space-y-2">
          <p className="text-label font-medium text-text-muted">Post Length</p>
          <div className="flex flex-wrap gap-2">
            {[400, 800, 1200].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setLength(len)}
                className={`rounded-pill border px-4 py-2 text-body-sm transition ${
                  length === len ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted"
                }`}
              >
                {len === 400 ? "Short (400 words)" : len === 800 ? "Medium (800 words)" : "Long (1200 words)"}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!topic || generating}
          className="w-full"
          size="lg"
        >
          {generating ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Generate Blog Post
            </>
          )}
        </Button>

        {history.length > 0 && (
          <div className="space-y-2">
            <p className="text-label text-text-muted uppercase">Recent Prompts</p>
            <div className="space-y-1">
              {history.slice(0, 3).map((item) => (
                <button
                  key={item.timestamp}
                  className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left text-body-sm text-text-primary hover:border-primary"
                  onClick={() => setTopic(item.topic)}
                >
                  <span className="line-clamp-1">{item.topic}</span>
                  <span className="text-label text-text-light">{timeAgo(item.timestamp)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${statusConfig[status].color}`} />
          <span className="text-body-sm text-text-muted">{statusConfig[status].label}</span>
        </div>
        {renderPreview()}
      </div>
    </div>
  );
}

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toneLabel(value) {
  switch (value) {
    case "friendly":
      return "friendly and conversational";
    case "educational":
      return "educational and informative";
    case "inspirational":
      return "inspirational and motivating";
    default:
      return "professional and warm";
  }
}

function ActionButton({ label, icon: Icon, onClick, variant = "primary", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-1 items-center justify-center gap-2 rounded-pill px-5 py-3 text-body-sm font-semibold transition ${
        variant === "secondary"
          ? "border border-primary text-primary hover:bg-primary-light"
          : "bg-primary text-white hover:bg-primary-dark"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function LoadingPreview() {
  const widths = ["w-full", "w-11/12", "w-10/12", "w-9/12", "w-8/12", "w-7/12"];
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      {widths.map((w, idx) => (
        <Skeleton key={idx} className={`h-3 ${w}`} />
      ))}
    </div>
  );
}

function SavingIcon(loading) {
  return loading ? Loader2 : Save;
}
