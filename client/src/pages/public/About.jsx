import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Target,
  Eye,
  Shield,
  Award,
  Users,
  CheckCircle,
  Home,
  Star,
  MessageCircle,
  Mail,
} from "lucide-react";
import { SEO } from "../../components/shared/SEO";
import CareerTimeline from "../../components/shared/CareerTimeline";
import { PolaroidCarousel } from "../../components/shared/PolaroidCarousel";
import { PolaroidCard } from "../../components/shared/PolaroidCard";
import {
  OWNER,
  STATS,
  TIMELINE,
  CERTIFICATIONS,
  GALLERY,
} from "../../data/about";

const ICON_MAP = { Shield, Award, Users, CheckCircle, Home, Star };

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hello Maryann! I found your profile on ChyChyAgent and I would like to discuss your services.",
)}`;

/* ─── CountUp ─────────────────────────────────────── */
function CountUp({ end, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const numericEnd = parseInt(end.replace(/\D/g, ""), 10);
    if (isNaN(numericEnd)) return;
    const suffix = end.replace(/[0-9]/g, "");
    let start = 0;
    const step = numericEnd / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericEnd) {
        setCount(numericEnd);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration, isInView]);

  const suffix = end.replace(/[0-9]/g, "");
  return <span ref={ref}>{isInView ? `${count}${suffix}` : "0"}</span>;
}

/* ─── About Page ──────────────────────────────────── */
export default function About() {
  return (
    <div>
      <SEO
        title="About Eloike Maryann — 15 Years in Real Estate & Insurance"
        description="Meet Maryann Chieboam Eloike, founder of ChyChyAgent. 10 years at AIICO Insurance and 5 years at AY Housing. Lagos-based real estate and insurance advisor."
        url="/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Maryann Chieboam Eloike",
          jobTitle: "Real Estate & Insurance Advisor",
          worksFor: { "@type": "Organization", name: "ChyChyAgent" },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lagos",
            addressCountry: "NG",
          },
          knowsAbout: [
            "Real Estate",
            "Insurance",
            "Property Investment",
            "Life Insurance",
            "Lagos Property Market",
          ],
        }}
      />

      {/* ── Section 1 — Hero strip ────────────────── */}
      <section className="border-b border-border bg-surface-soft">
        <div className="mx-auto grid min-h-[320px] max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-[3fr_2fr]">
          <div className="space-y-4">
            <nav className="text-label text-text-muted">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-text-primary">About</span>
            </nav>
            <p className="font-mono text-label uppercase tracking-wider text-primary">
              About ChyChyAgent
            </p>
            <h1 className="font-display text-display-xl text-text-primary leading-tight">
              15 Years of Trust,
              <br />
              <span className="italic text-primary">
                Expertise &amp; Results
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-body-lg leading-relaxed text-text-muted">
              {OWNER.bio.opening}
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-label text-text-muted">
              <MapPin size={14} className="text-primary" />
              {OWNER.location}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-center gap-4 overflow-hidden py-4 md:h-[400px]"
          >
            {GALLERY.slice(0, 3).map((photo, i) => (
              <PolaroidCard key={photo.id} photo={photo} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 2 — Stats bar ─────────────────── */}
      <section className="bg-primary py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 md:grid-cols-4">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`text-center ${
                idx < STATS.length - 1 ? "md:border-r md:border-white/20" : ""
              }`}
            >
              <p className="font-display text-display-xl text-white">
                <CountUp end={stat.value} />
              </p>
              <p className="mt-1 text-body-sm text-white/80">{stat.label}</p>
              <p className="mt-1 font-mono text-label text-white/60">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3 — Her Story ─────────────────── */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute left-6 top-12 select-none font-display text-[8rem] leading-none text-text-primary opacity-[0.04]">
          Her Story
        </div>
        <div className="mx-auto grid max-w-4xl gap-10 px-6 md:grid-cols-[55fr_45fr]">
          <div className="space-y-6">
            <p className="text-body-lg leading-relaxed text-text-muted">
              {OWNER.bio.opening}
            </p>
            <p className="text-body-lg leading-relaxed text-text-muted">
              {OWNER.bio.middle}
            </p>
            <p className="text-body-lg leading-relaxed text-text-muted">
              {OWNER.bio.closing}
            </p>
          </div>

          <div className="sticky top-24 h-fit rounded-lg border border-border border-l-4 border-l-primary bg-surface p-8">
            <span className="absolute left-6 top-4 select-none font-display text-[6rem] leading-none text-primary opacity-20">
              &ldquo;
            </span>
            <p className="relative z-10 font-display text-display-md italic leading-relaxed text-text-primary">
              {OWNER.quote.text}
            </p>
            <p className="mt-6 font-mono text-label text-text-muted">
              {OWNER.quote.attribution}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4 — Career Timeline ───────────── */}
      <CareerTimeline
        items={TIMELINE}
        title="Career Timeline"
        subtitle="15 years across insurance and real estate"
      />

      {/* ── Section 5 — Mission & Vision ──────────── */}
      <section className="bg-surface-soft py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-xl border border-border bg-surface p-10">
              <Target size={32} className="text-primary" />
              <h3 className="mt-4 font-display text-display-md text-text-primary">
                Our Mission
              </h3>
              <p className="mt-4 text-body-lg leading-relaxed text-text-muted">
                {OWNER.mission}
              </p>
              <div className="mt-8 h-1 w-12 bg-primary" />
            </div>

            {/* Vision */}
            <div className="rounded-xl border border-border bg-surface p-10">
              <Eye size={32} className="text-accent" />
              <h3 className="mt-4 font-display text-display-md text-text-primary">
                Our Vision
              </h3>
              <p className="mt-4 text-body-lg leading-relaxed text-text-muted">
                {OWNER.vision}
              </p>
              <div className="mt-8 h-1 w-12 bg-accent" />
            </div>
          </div>

          {/* Values */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {OWNER.values.map((v) => {
              const Icon = ICON_MAP[v.icon] || Shield;
              return (
                <div
                  key={v.title}
                  className="rounded-lg border border-border bg-surface p-6 transition-transform hover:-translate-y-0.5"
                >
                  <Icon size={24} className="text-primary" />
                  <h4 className="mt-3 font-semibold text-text-primary">
                    {v.title}
                  </h4>
                  <p className="mt-2 text-body-sm text-text-muted">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 6 — Certifications ────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center font-display text-display-xl text-text-primary">
            Certifications &amp; Professional Background
          </h2>
          <p className="mx-auto mt-3 text-center text-body-lg text-text-muted">
            Built on verified expertise and industry recognition.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CERTIFICATIONS.map((cert) => {
              const Icon = ICON_MAP[cert.icon] || Award;
              return (
                <div
                  key={cert.id}
                  className="rounded-lg border border-border border-t-[3px] border-t-primary bg-surface p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-hover"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <p className="mt-4 font-semibold leading-snug text-text-primary line-clamp-2">
                    {cert.title}
                  </p>
                  <p className="mt-2 font-mono text-label text-text-muted">
                    {cert.org}
                  </p>
                  {cert.year && (
                    <p className="mt-1 font-mono text-label text-text-light">
                      {cert.year}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center font-mono text-label text-text-muted">
            More certifications to be added.
          </p>
        </div>
      </section>

      {/* ── Section 7 — Photo Gallery ──────────────── */}
      <section style={{ padding: "4rem 0", overflow: "hidden" }}>
        <PolaroidCarousel />
      </section>

      {/* ── Section 8 — WhatsApp CTA ──────────────── */}
      <section className="bg-surface-soft py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 md:grid-cols-2">
          <div className="space-y-4">
            <p className="font-mono text-label uppercase tracking-wider text-primary">
              Work With Maryann
            </p>
            <h2 className="font-display text-display-xl text-text-primary leading-tight">
              Ready to find your perfect
              <br />
              <span className="italic">property or plan?</span>
            </h2>
            <p className="mt-4 text-body-lg text-text-muted">
              15 years of expertise, one WhatsApp message away.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-8 shadow-card">
            <h3 className="font-semibold text-text-primary">
              Start a conversation
            </h3>
            <p className="mt-2 text-body-sm text-text-muted">
              Maryann personally responds to every enquiry.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-body-md font-semibold text-white transition hover:bg-[#1fb855]"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
            <a
              href={`mailto:${OWNER.email}`}
              className="mt-4 block text-center font-mono text-label text-text-muted transition hover:text-primary"
            >
              <Mail size={14} className="mr-1 inline" />
              or email {OWNER.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
