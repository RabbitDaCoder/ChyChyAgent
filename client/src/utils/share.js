// ── Owner social handles ──────────────────────────────
// Update these when Maryann provides real handles
export const SOCIAL_HANDLES = {
  twitter: "@ChyChyAgent", // placeholder
  instagram: "@chychyagent", // placeholder
  facebook: "ChyChyAgent", // placeholder
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER,
};

const SITE_URL = import.meta.env.VITE_SITE_URL;

// ── URL builder ───────────────────────────────────────
// Ensures we always share clean canonical URLs
export function buildPostUrl(slug) {
  return `${SITE_URL}/blog/${slug}`;
}

// ── Unified share message ─────────────────────────────
// Used across all text-based platforms
export function buildShareMessage(title, slug) {
  const url = buildPostUrl(slug);
  const waLink = `https://wa.me/${SOCIAL_HANDLES.whatsapp}`;
  return `Post from ${title} - \n\n\n ${url} -\n\n\nMessage me at\n\n\n${waLink}`;
}

// ── Twitter/X share ───────────────────────────────────
export function buildTwitterShare(title, slug) {
  const text = buildShareMessage(title, slug);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

// ── WhatsApp status share ─────────────────────────────
export function buildWhatsAppShare(title, slug) {
  const message = buildShareMessage(title, slug);
  const isMobile = /iPhone|Android/i.test(navigator.userAgent);
  const base = isMobile ? "whatsapp://send" : "https://web.whatsapp.com/send";
  return `${base}?text=${encodeURIComponent(message)}`;
}

// ── Facebook share ────────────────────────────────────
// Facebook scrapes OG tags from the URL automatically
export function buildFacebookShare(slug) {
  const url = buildPostUrl(slug);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

// ── Instagram caption builder ─────────────────────────
// Instagram has no web share API — copy caption to clipboard
export function buildInstagramCaption(title, slug) {
  return buildShareMessage(title, slug);
}

// ── Clipboard copy ────────────────────────────────────
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
}

// ── Open share URL in new tab ─────────────────────────
export function openShareUrl(url) {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
}
