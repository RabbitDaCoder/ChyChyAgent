import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  Sparkles,
  HeartPulse,
  Building2,
  ChevronDown,
} from "lucide-react";
import useInsurance from "../../hooks/useInsurance";
import InsurancePlanCard from "../../components/shared/InsurancePlanCard";
import Skeleton from "../../components/ui/Skeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import SEO from "../../components/shared/SEO";
import { buildOrgSchema } from "../../utils/schema";
import WhatsAppButton from "../../components/ui/WhatsAppButton";

const categories = [
  { label: "All", value: "all" },
  { label: "Life", value: "life" },
  { label: "Health", value: "health" },
  { label: "Property", value: "property" },
  { label: "Auto", value: "auto" },
  { label: "Business", value: "business" },
];

const faqs = [
  {
    q: "How do I get started with a plan?",
    a: "Simply tap the WhatsApp button on any plan and Eloike will guide you through the process.",
  },
  {
    q: "Are these plans available across Nigeria?",
    a: "Yes, our plans cover all 36 states.",
  },
  {
    q: "Can I get a custom plan for my business?",
    a: "Absolutely — contact us via WhatsApp and we will create a plan tailored to your business.",
  },
  {
    q: "How do I make a claim?",
    a: "Reach out on WhatsApp and we will assist you through the claims process step by step.",
  },
  {
    q: "Is my payment secure?",
    a: "All transactions go through verified and licensed insurance providers.",
  },
];

export default function Insurance() {
  const { data: plans, loading } = useInsurance();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(0);

  const filteredPlans = useMemo(() => {
    if (activeCategory === "all") return plans;
    return plans.filter((p) => p.category === activeCategory);
  }, [activeCategory, plans]);

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const quoteLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello Eloike! I'm interested in getting an insurance quote. Please advise.",
  )}`;

  return (
    <section className="py-10 space-y-10">
      <SEO
        title="Insurance Plans — Life, Health, Property & Auto"
        description="Protect your assets with insurance plans designed for Nigerians. Life, health, property, and auto coverage. Get a quote on WhatsApp today."
        url="/insurance"
        schema={buildOrgSchema()}
      />

      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Insurance", href: "/insurance" },
        ]}
      />

      <div className="grid gap-8 overflow-hidden rounded-xl border border-border bg-surface-soft p-6 md:grid-cols-2 md:p-10">
        <div className="space-y-4">
          <p className="text-label font-mono uppercase tracking-wide text-primary">
            Insurance Plans
          </p>
          <h1 className="font-display text-display-xl text-text-primary leading-tight">
            Protect What Matters Most
          </h1>
          <p className="text-body-lg text-text-muted">
            Comprehensive coverage designed for Nigerians, backed by trusted
            providers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppButton
              href={quoteLink}
              label="Get a free quote →"
              size="lg"
            />
            <div className="flex items-center gap-2 rounded-pill bg-surface px-3 py-2 text-label text-text-muted">
              <Shield size={14} />
              Response within minutes
            </div>
          </div>
        </div>
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <div className="relative h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-8 rounded-3xl border border-primary/30 bg-surface shadow-hover" />
          <Shield className="absolute h-16 w-16 text-primary" />
          <Sparkles className="absolute right-10 top-10 h-8 w-8 text-accent" />
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-80 w-full" />
            ))}
          {!loading &&
            filteredPlans.map((plan) => (
              <InsurancePlanCard key={plan._id} plan={plan} />
            ))}
          {!loading && filteredPlans.length === 0 && (
            <p className="col-span-full text-center text-body-md text-text-muted">
              No plans available for this category right now.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-display text-display-lg text-text-primary">
          Why Get Insured?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <BenefitCard
            icon={<HeartPulse className="text-primary" />}
            title="Financial Security"
            desc="Safeguard your family and assets against unexpected events."
          />
          <BenefitCard
            icon={<Shield className="text-primary" />}
            title="Peace of Mind"
            desc="Feel confident knowing you're covered by trusted providers."
          />
          <BenefitCard
            icon={<Building2 className="text-primary" />}
            title="Asset Protection"
            desc="Keep your home, business, and vehicles protected and compliant."
          />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-display-lg text-text-primary">
          Common Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.q}
              className="rounded-lg border border-border bg-surface-soft"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-body-md font-medium text-text-primary"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                {faq.q}
                <motion.span animate={{ rotate: openFaq === idx ? 180 : 0 }}>
                  <ChevronDown />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 text-body-sm text-text-muted"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-primary px-6 py-8 text-white shadow-hover">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-display-md">
              Not sure which plan is right for you?
            </h3>
            <p className="text-body-md text-white/80">
              Chat with Eloike and get a personalised recommendation in minutes.
            </p>
          </div>
          <WhatsAppButton
            href={quoteLink}
            label="Chat on WhatsApp"
            size="md"
            fullWidth={false}
          />
        </div>
      </div>

      {/* Advisor card */}
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-soft p-8 text-center md:flex-row md:text-left">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white">
          ME
        </div>
        <div>
          <p className="font-mono text-label uppercase tracking-wide text-primary">
            Your Insurance Advisor
          </p>
          <p className="mt-1 font-semibold text-text-primary">Eloike Maryann</p>
          <p className="text-body-sm text-text-muted">
            10 years at AIICO Insurance Company
          </p>
          <WhatsAppButton
            href={quoteLink}
            label="Ask Maryann directly"
            size="sm"
            fullWidth={false}
            className="mt-3"
          />
        </div>
      </div>
    </section>
  );
}

function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence>
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={`relative rounded-pill px-4 py-2 text-label font-medium transition ${
              active === cat.value ? "text-white" : "text-text-muted"
            }`}
          >
            {active === cat.value && (
              <motion.span
                layoutId="cat"
                className="absolute inset-0 rounded-pill bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

function BenefitCard({ icon, title, desc }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface-soft p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-lg text-text-primary">{title}</h3>
      <p className="text-body-sm text-text-muted">{desc}</p>
    </div>
  );
}

BenefitCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  desc: PropTypes.string,
};
