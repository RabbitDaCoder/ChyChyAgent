import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildTwitterShare,
  buildWhatsAppShare,
  buildFacebookShare,
  buildInstagramCaption,
  buildPostUrl,
  copyToClipboard,
  openShareUrl,
} from "../../utils/share";

export function ShareBar({ title, slug }) {
  const [copied, setCopied] = useState(null);
  const [igCopied, setIgCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function toast(msg) {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  function handleTwitter() {
    openShareUrl(buildTwitterShare(title, slug));
  }

  function handleWhatsApp() {
    openShareUrl(buildWhatsAppShare(title, slug));
  }

  function handleFacebook() {
    openShareUrl(buildFacebookShare(slug));
  }

  async function handleInstagram() {
    const caption = buildInstagramCaption(title, slug);
    await copyToClipboard(caption);
    setIgCopied(true);
    toast("Caption copied! Open Instagram and paste it.");
    setTimeout(() => setIgCopied(false), 3000);
    setTimeout(() => {
      window.open(
        "https://www.instagram.com/",
        "_blank",
        "noopener,noreferrer",
      );
    }, 600);
  }

  async function handleCopyLink() {
    const url = buildPostUrl(slug);
    await copyToClipboard(url);
    setCopied("link");
    toast("Link copied to clipboard!");
    setTimeout(() => setCopied(null), 2500);
  }

  const buttons = [
    {
      id: "twitter",
      label: "Share on X",
      color: "#000000",
      handler: handleTwitter,
      active: false,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "whatsapp",
      label: "Share on WhatsApp",
      color: "#25D366",
      handler: handleWhatsApp,
      active: false,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.519 5.831L.057 23.625a.75.75 0 00.918.918l5.815-1.461A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.956-1.355l-.355-.211-3.655.918.933-3.614-.23-.374A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      label: "Share on Facebook",
      color: "#1877F2",
      handler: handleFacebook,
      active: false,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: "instagram",
      label: igCopied ? "Caption copied!" : "Share on Instagram",
      color: "#E1306C",
      handler: handleInstagram,
      active: igCopied,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      id: "copy",
      label: copied === "link" ? "Copied!" : "Copy link",
      color: "#6B6B6B",
      handler: handleCopyLink,
      active: copied === "link",
      icon:
        copied === "link" ? (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        ),
    },
  ];

  return (
    <>
      {/* Desktop: inline bar below post */}
      <div className="hidden md:block">
        <div
          style={{
            borderTop: "1px solid var(--color-border, #EDE8E3)",
            paddingTop: "1.5rem",
            marginTop: "2rem",
          }}
        >
          <p
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-text-muted, #8A7468)",
              marginBottom: "0.75rem",
            }}
          >
            Share this post
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {buttons.map((btn) => (
              <ShareButton key={btn.id} btn={btn} size="md" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "var(--color-surface, #FFFFFF)",
          borderTop: "1px solid var(--color-border, #EDE8E3)",
          padding: "0.75rem 1rem",
          display: "flex",
          gap: "0.5rem",
          justifyContent: "center",
          boxShadow: "0 -4px 24px rgba(44,31,26,0.08)",
        }}
      >
        {buttons.map((btn) => (
          <ShareButton key={btn.id} btn={btn} size="sm" />
        ))}
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              bottom: "5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              background: "var(--color-text-primary, #2C1F1A)",
              color: "#FFFFFF",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.875rem",
              padding: "0.6rem 1.25rem",
              borderRadius: "9999px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ShareButton({ btn, size }) {
  const isSmall = size === "sm";
  return (
    <button
      onClick={btn.handler}
      title={btn.label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: isSmall ? "0" : "0.4rem",
        padding: isSmall ? "0.5rem" : "0.5rem 1rem",
        borderRadius: "9999px",
        border: "none",
        background: btn.active ? btn.color : "transparent",
        color: btn.active ? "#FFFFFF" : btn.color,
        outline: `1.5px solid ${btn.color}`,
        cursor: "pointer",
        fontFamily: "DM Sans, sans-serif",
        fontSize: "0.8rem",
        fontWeight: 500,
        transition: "all 0.18s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = btn.color;
        e.currentTarget.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        if (!btn.active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = btn.color;
        }
      }}
    >
      {btn.icon}
      {!isSmall && <span style={{ whiteSpace: "nowrap" }}>{btn.label}</span>}
    </button>
  );
}

export default ShareBar;
