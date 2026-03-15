import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { formattedDate } from "../../utils/dateFormatter";
import { truncateText } from "../../hooks/truncateText";
import {
  buildTwitterShare,
  buildWhatsAppShare,
  buildFacebookShare,
  buildPostUrl,
  copyToClipboard,
  openShareUrl,
} from "../../utils/share";

export default function BlogCard({
  title,
  category,
  excerpt,
  coverImage,
  slug = "#",
  readTime,
  createdAt,
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [cardCopied, setCardCopied] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!shareOpen) return;
    function handleClick(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [shareOpen]);

  const iconBtnStyle = (color) => ({
    background: "transparent",
    border: `1px solid ${color}`,
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color,
  });

  return (
    <Card hover className="overflow-hidden">
      <img
        src={
          coverImage ||
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"
        }
        alt={title}
        className="h-44 w-full object-cover"
      />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <Badge>{category || "Real Estate"}</Badge>
          {readTime && (
            <span className="text-label text-text-muted">
              {readTime} min read
            </span>
          )}
        </div>
        <h3 className="font-display text-xl text-text-primary leading-tight">
          {title}
        </h3>
        <p className="text-text-muted text-body-sm">
          {truncateText(excerpt || "", 110)}
        </p>
        <div className="flex items-center justify-between text-label text-text-light">
          <span>{formattedDate(createdAt || new Date())}</span>
          <div className="flex items-center gap-3">
            <Link to={`/blog/${slug}`} className="text-primary hover:underline">
              Read more →
            </Link>
            <div style={{ position: "relative" }} ref={popoverRef}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShareOpen((o) => !o);
                }}
                title="Share this post"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>

              {shareOpen && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    background: "var(--color-surface, #FFFFFF)",
                    border: "1px solid var(--color-border, #EDE8E3)",
                    borderRadius: "12px",
                    padding: "0.5rem",
                    display: "flex",
                    gap: "0.4rem",
                    boxShadow: "0 4px 24px rgba(44,31,26,0.1)",
                    zIndex: 20,
                  }}
                >
                  {/* Twitter */}
                  <button
                    onClick={() => openShareUrl(buildTwitterShare(title, slug))}
                    style={iconBtnStyle("#000")}
                    title="Share on X"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  {/* WhatsApp */}
                  <button
                    onClick={() =>
                      openShareUrl(buildWhatsAppShare(title, slug))
                    }
                    style={iconBtnStyle("#25D366")}
                    title="WhatsApp"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.519 5.831L.057 23.625a.75.75 0 00.918.918l5.815-1.461A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.956-1.355l-.355-.211-3.655.918.933-3.614-.23-.374A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                    </svg>
                  </button>
                  {/* Facebook */}
                  <button
                    onClick={() => openShareUrl(buildFacebookShare(slug))}
                    style={iconBtnStyle("#1877F2")}
                    title="Facebook"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  {/* Copy */}
                  <button
                    onClick={async () => {
                      await copyToClipboard(buildPostUrl(slug));
                      setCardCopied(true);
                      setTimeout(() => setCardCopied(false), 2000);
                    }}
                    style={iconBtnStyle(cardCopied ? "#25D366" : "#6B6B6B")}
                    title="Copy link"
                  >
                    {cardCopied ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

BlogCard.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  excerpt: PropTypes.string,
  coverImage: PropTypes.string,
  slug: PropTypes.string,
  readTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};
