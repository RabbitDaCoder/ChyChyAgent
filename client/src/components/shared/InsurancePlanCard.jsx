import PropTypes from "prop-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown, Shield } from "lucide-react";
import WhatsAppButton from "../ui/WhatsAppButton";
import { buildInsuranceWhatsAppLink } from "../../utils/whatsapp";
import { optimizeImage } from "../../utils/cloudinary";
import ImageWithFallback from "../ui/ImageWithFallback";

export default function InsurancePlanCard({ plan }) {
  const [showAll, setShowAll] = useState(false);
  const features = plan.features || [];
  const displayed = showAll ? features : features.slice(0, 4);
  const hasMore = features.length > 4;
  const image = optimizeImage(plan.image, { width: 600 });

  return (
    <motion.article
      id={plan._id}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(44,31,26,0.10)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface shadow-card transition-colors ${
        plan.popular
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/30"
      }`}
    >
      {/* Popular ribbon */}
      {plan.popular && (
        <div className="absolute left-0 top-0 z-10">
          <div className="flex items-center gap-1.5 rounded-br-xl bg-primary px-4 py-1.5">
            <Shield size={12} className="text-white" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
              Most Popular
            </span>
          </div>
        </div>
      )}

      {/* Image section */}
      {plan.image ? (
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={`${plan.name} insurance`}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-pill bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary backdrop-blur-sm">
            {plan.category || "Insurance"}
          </span>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
          <Shield size={40} className="text-primary/30" />
          <span className="absolute bottom-3 left-3 rounded-pill bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {plan.category || "Insurance"}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-text-primary leading-snug">
          {plan.name}
        </h3>

        <p className="mt-2 text-body-sm text-text-muted line-clamp-2">
          {plan.description}
        </p>

        {/* Price */}
        {plan.price && (
          <div className="mt-3 inline-flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-primary">
              {plan.price}
            </span>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <AnimatePresence initial={false}>
              {displayed.map((feature) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-body-sm text-text-primary"
                >
                  <CheckCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {hasMore && (
              <button
                type="button"
                className="flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
                onClick={() => setShowAll((p) => !p)}
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showAll ? "rotate-180" : ""}`}
                />
                {showAll
                  ? "Show less"
                  : `+${features.length - 4} more features`}
              </button>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-5">
          <WhatsAppButton
            fullWidth
            href={buildInsuranceWhatsAppLink(plan)}
            label="Get This Plan"
            size="sm"
          />
        </div>
      </div>
    </motion.article>
  );
}

InsurancePlanCard.propTypes = {
  plan: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    features: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    popular: PropTypes.bool,
    order: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
};
