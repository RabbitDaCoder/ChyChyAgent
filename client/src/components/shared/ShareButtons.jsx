import { useState } from "react";
import { Link2, Check, MessageCircle } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import toast from "react-hot-toast";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export default function ShareButtons({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const postUrl = `${siteUrl}/blog/${slug}`;

  const shareText = `${title} — ${postUrl}`;

  const links = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366] hover:bg-[#1ebe57]",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Check out this post from ChyChyAgent 🏠\n\n${title}\n${postUrl}`)}`,
    },
    {
      name: "X",
      icon: FaXTwitter,
      color: "bg-[#0f1419] hover:bg-[#272c30]",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      color: "bg-[#1877F2] hover:bg-[#0d65d9]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(title)}`,
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color:
        "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90",
      // Instagram doesn't have a direct share URL; copy link instead with a prompt
      href: null,
      action: () => {
        navigator.clipboard.writeText(`${title}\n\n${postUrl}`).then(() => {
          toast.success(
            "Link copied! Paste it in your Instagram story or post.",
          );
        });
      },
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-label font-medium text-text-muted">Share this post</p>
      <div className="flex flex-wrap items-center gap-2">
        {links.map(({ name, icon: Icon, color, href, action }) => {
          const className = `flex items-center gap-2 rounded-pill px-4 py-2 text-label text-white transition-all ${color}`;

          if (action) {
            return (
              <button key={name} onClick={action} className={className}>
                <Icon size={16} />
                <span className="hidden sm:inline">{name}</span>
              </button>
            );
          }

          return (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{name}</span>
            </a>
          );
        })}

        <button
          onClick={copyLink}
          className="flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 text-label text-text-primary transition-all hover:bg-surface-soft"
        >
          {copied ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Link2 size={16} />
          )}
          <span className="hidden sm:inline">
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </button>
      </div>
    </div>
  );
}
