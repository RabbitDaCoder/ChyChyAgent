import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PropTypes from "prop-types";
import { TIMELINE_TYPE_STYLES } from "../../data/about";

export default function CareerTimeline({ items, title, subtitle }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        {title && (
          <h2 className="text-center font-display text-display-xl text-text-primary">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mx-auto mt-3 text-center text-body-lg text-text-muted">
            {subtitle}
          </p>
        )}

        <div className="relative mt-16">
          {/* Central vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {items.map((item, idx) => (
              <TimelineEntry key={item.id} item={item} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

CareerTimeline.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

function TimelineEntry({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;
  const style =
    TIMELINE_TYPE_STYLES[item.type] || TIMELINE_TYPE_STYLES.education;

  return (
    <div
      ref={ref}
      className={`relative flex items-start md:items-center ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Dot on the line */}
      <div className="absolute left-5 z-10 flex -translate-x-1/2 items-center justify-center md:left-1/2">
        <span
          className={`h-4 w-4 rounded-full border-2 border-primary ${
            item.current
              ? "bg-primary"
              : item.type === "insurance"
                ? "bg-accent-soft"
                : "bg-surface"
          }`}
        />
        {item.current && (
          <span className="absolute h-8 w-8 animate-ping rounded-full bg-primary/20" />
        )}
      </div>

      {/* Spacer for the other side (desktop) */}
      <div className="hidden w-1/2 md:block" />

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 * index, ease: "easeOut" }}
        className={`ml-12 w-full max-w-[420px] rounded-lg border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-hover md:ml-0 ${
          isLeft ? "md:mr-8" : "md:ml-8"
        }`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 font-mono text-label ${style.bg} ${style.text}`}
          >
            {style.label}
          </span>
          <span className="font-mono text-label text-text-muted">
            {item.year}
          </span>
        </div>

        {/* Organisation */}
        <p className="mt-3 font-semibold text-text-primary">{item.org}</p>
        {item.highlight && (
          <p className="text-body-sm italic text-primary">{item.highlight}</p>
        )}

        {/* Role */}
        <p className="mt-1 font-mono text-label text-primary">{item.role}</p>

        {/* Summary */}
        <p className="mt-3 text-body-sm leading-relaxed text-text-muted">
          {item.summary}
        </p>

        {/* Current badge */}
        {item.current && (
          <span className="mt-4 inline-block rounded-full bg-success/10 px-3 py-1 font-mono text-label text-success">
            Current Role
          </span>
        )}
      </motion.div>
    </div>
  );
}

TimelineEntry.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
