import { useRef } from "react";
import { GALLERY } from "../../data/about";
import { PolaroidCard } from "./PolaroidCard";

export function PolaroidCarousel() {
  const trackRef = useRef(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  function onMouseDown(e) {
    isDown = true;
    startX = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grabbing";
    }
  }

  function onMouseLeave() {
    isDown = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  }

  function onMouseUp() {
    isDown = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  }

  function onMouseMove(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1.6;
    if (trackRef.current) {
      trackRef.current.scrollLeft = scrollLeft - walk;
    }
  }

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        paddingBottom: "2rem",
        paddingTop: "1.5rem",
      }}
    >
      {/* Section label */}
      <p
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#B5A49C",
          textAlign: "center",
          marginBottom: "1.25rem",
        }}
      >
        Moments & milestones
      </p>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="polaroid-track"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1.25rem",
          justifyContent: "center",
          alignItems: "flex-end",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: "grab",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>{`.polaroid-track::-webkit-scrollbar { display: none; }`}</style>

        {GALLERY.map((photo, i) => (
          <div key={photo.id} style={{ scrollSnapAlign: "center" }}>
            <PolaroidCard photo={photo} index={i} />
          </div>
        ))}
      </div>

      {/* Drag hint — only on mobile */}
      <p
        className="md:hidden"
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "0.65rem",
          color: "#B5A49C",
          textAlign: "center",
          marginTop: "0.75rem",
          letterSpacing: "0.08em",
        }}
      >
        Swipe to see more
      </p>
    </div>
  );
}

export default PolaroidCarousel;
