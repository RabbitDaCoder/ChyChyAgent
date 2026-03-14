import PropTypes from "prop-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import PriceDisplay from "../ui/PriceDisplay";
import WhatsAppButton from "../ui/WhatsAppButton";
import { buildInsuranceWhatsAppLink } from "../../utils/whatsapp";
import { optimizeImage } from "../../utils/cloudinary";
import ImageWithFallback from "../ui/ImageWithFallback";

export default function InsurancePlanCard({ plan }) {
  const [showAll, setShowAll] = useState(false);
  const features = plan.features || [];
  const displayed = showAll ? features : features.slice(0, 6);
  const hasMore = features.length > 6;
  const image = optimizeImage(plan.image, { width: 600 });

  return (
    <motion.article
      id={plan._id}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={`relative flex h-full flex-col rounded-lg border bg-surface p-6 shadow-card ${
        plan.popular ? "border-2 border-primary" : "border-border"
      }`}
    >
      {plan.popular && (
        <span className="absolute right-4 top-4 rounded-pill bg-accent px-3 py-1 text-label font-mono text-text-primary">
          Most Popular
        </span>
      )}

      <div className="mb-4 flex items-start gap-3">
        <span className="rounded-pill bg-accent-soft px-3 py-1 text-label font-mono uppercase text-primary">
          {plan.category}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-display-md text-text-primary leading-tight">
          {plan.name}
        </h3>
        {plan.image && (
          <div className="overflow-hidden rounded-lg">
            <ImageWithFallback
              src={image}
              alt={`${plan.name} insurance`}
              className="h-40 w-full object-cover"
            />
          </div>
        )}
        <p className="text-body-sm text-text-muted line-clamp-3">{plan.description}</p>
        <div className="text-display-md font-semibold text-primary">
          {typeof plan.price === "number" ? <PriceDisplay usdAmount={plan.price} /> : plan.price}
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-2 text-body-sm text-text-primary">
        <AnimatePresence initial={false}>
          {displayed.map((feature) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-md bg-surface-soft px-3 py-2"
            >
              <CheckCircle size={14} className="text-primary" />
              <span>{feature}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {hasMore && (
          <button
            type="button"
            className="text-label font-medium text-primary underline underline-offset-4"
            onClick={() => setShowAll((p) => !p)}
          >
            {showAll ? "Show less" : `Show all ${plan.features.length} features`}
          </button>
        )}
      </div>

      <div className="mt-6">
        <WhatsAppButton
          fullWidth
          href={buildInsuranceWhatsAppLink(plan)}
          label="Get This Plan on WhatsApp"
        />
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
