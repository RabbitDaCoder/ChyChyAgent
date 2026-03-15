import { motion } from "framer-motion";

export function PolaroidCard({ photo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: photo.rotation }}
      animate={{ opacity: 1, y: 0, rotate: photo.rotation }}
      transition={{
        duration: 0.6,
        delay: 0.1 + index * 0.09,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        y: -12,
        rotate: photo.rotation * 0.25,
        scale: 1.05,
        zIndex: 20,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      style={{
        transformOrigin: "center bottom",
        cursor: "default",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "#F7F3EE",
          padding: "10px 10px 44px 10px",
          width: "clamp(140px, 38vw, 168px)",
          borderRadius: "2px",
          boxShadow:
            "0 6px 28px rgba(44,31,26,0.14), 0 2px 8px rgba(44,31,26,0.08)",
        }}
      >
        {/* Photo area — square, scales with card width */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            backgroundColor: "#D5C5BB",
            position: "relative",
          }}
        >
          {photo.src ? (
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "none",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1.0)";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, #D5C5BB 0%, #C4B0A4 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="#8A7468"
                strokeWidth="1.5"
              >
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "10px",
                  color: "#8A7468",
                  letterSpacing: "0.05em",
                }}
              >
                Photo coming
              </span>
            </div>
          )}
        </div>

        {/* Caption — Caveat handwritten font */}
        <p
          style={{
            fontFamily: '"Caveat", cursive',
            fontSize: "14px",
            color: "#5C4438",
            textAlign: "center",
            marginTop: "10px",
            marginBottom: 0,
            lineHeight: 1.2,
            letterSpacing: "0.01em",
          }}
        >
          {photo.caption}
        </p>
      </div>
    </motion.div>
  );
}

export default PolaroidCard;
