import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize2, MapPin, Star } from "lucide-react";
import PriceDisplay from "../ui/PriceDisplay";
import WhatsAppButton from "../ui/WhatsAppButton";
import { buildListingWhatsAppLink } from "../../utils/whatsapp";
import { optimizeImage } from "../../utils/cloudinary";
import ImageWithFallback from "../ui/ImageWithFallback";

export default function ListingCard({ listing, priority = false }) {
  const cover = optimizeImage(listing.coverImage || listing.images?.[0], { width: 600 });
  const locationLabel = [
    listing.location?.address,
    listing.location?.city,
    listing.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card"
    >
      <Link to={`/listings/${listing.slug}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={cover}
            alt={`${listing.title} - ${listing.location?.city || "Property"}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <span className="rounded-pill bg-primary px-3 py-1 text-label font-mono uppercase text-white">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
            {listing.featured && (
              <span className="flex items-center gap-1 rounded-pill bg-surface/90 px-3 py-1 text-label font-mono text-primary shadow-soft backdrop-blur">
                <Star size={12} /> Featured
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/40 to-transparent"
          >
            <span className="absolute bottom-3 left-4 text-sm font-medium text-white">
              View Details →
            </span>
          </motion.div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-display text-xl text-text-primary line-clamp-1">
              <Link to={`/listings/${listing.slug}`} className="hover:text-primary">
                {listing.title}
              </Link>
            </h2>
            <div className="flex items-center gap-1 text-label text-text-muted">
              <MapPin size={14} />
              <span className="line-clamp-1">{locationLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <PriceDisplay usdAmount={Number(listing.price || 0)} />
          {listing.type === "rent" && <span className="text-label text-text-muted">/yr</span>}
        </div>

        <div className="flex items-center gap-3 text-label text-text-muted">
          <Feature icon={<Bed size={14} />} label={`${listing.features?.bedrooms || 0} Beds`} />
          <Divider />
          <Feature icon={<Bath size={14} />} label={`${listing.features?.bathrooms || 0} Baths`} />
          <Divider />
          <Feature icon={<Maximize2 size={14} />} label={`${listing.features?.sqm || 0} sqm`} />
        </div>
      </div>

      <div className="px-4 pb-4">
        <WhatsAppButton
          size="sm"
          fullWidth
          label="Enquire on WhatsApp"
          href={buildListingWhatsAppLink(listing)}
        />
      </div>
    </motion.article>
  );
}

function Feature({ icon, label }) {
  return (
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
  );
}

function Divider() {
  return <span className="h-4 w-px bg-border" />;
}

ListingCard.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    slug: PropTypes.string,
    type: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    coverImage: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    featured: PropTypes.bool,
    location: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
    }),
    features: PropTypes.shape({
      bedrooms: PropTypes.number,
      bathrooms: PropTypes.number,
      sqm: PropTypes.number,
    }),
  }).isRequired,
  priority: PropTypes.bool,
};
