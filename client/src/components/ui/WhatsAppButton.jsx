import PropTypes from "prop-types";
import { motion } from "framer-motion";

const base =
  "inline-flex items-center gap-2 rounded-pill text-white font-medium transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function WhatsAppButton({ href, label = "Chat on WhatsApp", size = "md", fullWidth }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${sizes[size]} ${fullWidth ? "w-full justify-center" : ""}`}
      style={{ backgroundColor: "#25D366" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex items-center gap-2">
        <WhatsAppIcon />
        {label}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[#25D366]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
      </span>
    </motion.a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.519 5.831L.057 23.625a.75.75 0 00.918.918l5.815-1.461A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.956-1.355l-.355-.211-3.655.918.933-3.614-.23-.374A9.714 9.714 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
    </svg>
  );
}

WhatsAppButton.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
};
