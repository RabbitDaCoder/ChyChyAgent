import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  Sofa,
  MapPin,
  Link2,
  Share2,
  CheckCircle2,
} from "lucide-react";
import useListing from "../../hooks/useListing";
import useListings from "../../hooks/useListings";
import ListingCard from "../../components/shared/ListingCard";
import PriceDisplay from "../../components/ui/PriceDisplay";
import WhatsAppButton from "../../components/ui/WhatsAppButton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Skeleton from "../../components/ui/Skeleton";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import { optimizeImage } from "../../utils/cloudinary";
import { buildListingWhatsAppLink } from "../../utils/whatsapp";
import api from "../../utils/api";
import { buildListingSchema, buildBreadcrumbSchema } from "../../utils/schema";
import SEO from "../../components/shared/SEO";

export default function ListingDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast() || {};
  const { data: listing, loading } = useListing(slug);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const similarParams = useMemo(
    () =>
      listing
        ? {
            city: listing.location?.city,
            type: listing.type,
            limit: 3,
            exclude: listing._id,
          }
        : null,
    [listing],
  );

  const { data: relatedListings, loading: relatedLoading } = useListings(
    similarParams || {},
    { enabled: !!similarParams },
  );

  const images = useMemo(() => {
    const gallery = listing?.images?.length
      ? listing.images
      : [listing?.coverImage].filter(Boolean);
    return (gallery || []).map((img, idx) => ({
      original: optimizeImage(img, { width: 1200 }),
      thumbnail: optimizeImage(img, { width: 200 }),
      originalAlt: `${listing?.title || "Property"} - Photo ${idx + 1}`,
      thumbnailAlt: `${listing?.title || "Property"} thumbnail ${idx + 1}`,
      loading: idx === 0 ? "eager" : "lazy",
    }));
  }, [listing]);

  const shareUrl = `${import.meta.env.VITE_SITE_URL}/listings/${slug}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    `Check out this property: ${listing?.title} ${shareUrl}`,
  )}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast?.("Link copied!", "success");
    } catch {
      showToast?.("Could not copy link", "error");
    }
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await api.post("/contact", {
        ...form,
        listing: listing?._id,
        service: "Real Estate",
      });
      setForm({ name: "", email: "", message: "" });
      showToast?.("Enquiry sent. We'll be in touch!", "success");
    } catch (err) {
      setFormError("Unable to send your message. Please try again.");
      showToast?.("Unable to send message", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 py-10">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!listing) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="font-display text-display-md text-text-primary">
          Listing not found
        </p>
        <button
          type="button"
          onClick={() => navigate("/listings")}
          className="rounded-pill bg-primary px-5 py-3 text-white"
        >
          Browse Properties
        </button>
      </div>
    );
  }

  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/listings" },
    { label: listing.title, href: `/listings/${listing.slug}` },
  ];

  return (
    <section className="py-10 space-y-6">
      <SEO
        title={`${listing.title} — ${listing.type === "sale" ? "For Sale" : "For Rent"} in ${
          listing.location?.city
        }`}
        description={`${listing.features?.bedrooms || 0} bedroom property ${
          listing.type === "sale" ? "for sale" : "for rent"
        } in ${listing.location?.city}, ${listing.location?.state}. $${listing.price?.toLocaleString()} USD. Contact ChyChyAgent on WhatsApp.`}
        image={listing.coverImage}
        url={`/listings/${listing.slug}`}
        type="article"
        schema={[
          buildListingSchema(listing),
          buildBreadcrumbSchema(breadcrumb),
        ]}
      />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-body-sm text-text-muted underline underline-offset-4 transition hover:text-primary"
      >
        ← Back to Properties
      </button>

      <Breadcrumb crumbs={breadcrumb} />

      {images.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border shadow-card">
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={true}
            slideDuration={450}
            additionalClass="listing-gallery"
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-primary px-3 py-1 text-label font-mono uppercase text-white">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
            <span className="rounded-pill bg-accent-soft px-3 py-1 text-label font-mono uppercase text-primary">
              {listing.status}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-display-xl text-text-primary leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-body-md text-text-muted">
              <MapPin size={18} />
              <span>
                {listing.location?.address}, {listing.location?.city},{" "}
                {listing.location?.state}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <PriceDisplay usdAmount={Number(listing.price || 0)} />
              {listing.type === "rent" && (
                <span className="text-body-md text-text-muted">/year</span>
              )}
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border border-border bg-surface-soft p-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Bed size={16} />}
              label={`${listing.features?.bedrooms || 0} Bedrooms`}
            />
            <Feature
              icon={<Bath size={16} />}
              label={`${listing.features?.bathrooms || 0} Bathrooms`}
            />
            <Feature
              icon={<Maximize2 size={16} />}
              label={`${listing.features?.sqm || 0} sqm`}
            />
            <Feature
              icon={<Car size={16} />}
              label={
                listing.features?.parking ? "Parking available" : "No parking"
              }
            />
            <Feature
              icon={<Sofa size={16} />}
              label={listing.features?.furnished ? "Furnished" : "Unfurnished"}
            />
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-display-md text-text-primary">
              About This Property
            </h2>
            <p className="text-body-md leading-relaxed text-text-muted">
              {listing.description}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-display-md text-text-primary">
              Location
            </h2>
            <div className="rounded-lg border border-border bg-surface-soft p-4">
              <p className="text-body-md text-text-muted">
                {listing.location?.address}
              </p>
              <div className="mt-3 flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-text-light">
                Map coming soon
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-display-md text-text-primary">
              Similar Properties
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedLoading &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-72 w-full" />
                ))}
              {!relatedLoading &&
                relatedListings
                  ?.filter((l) => l.slug !== listing.slug)
                  .map((item) => <ListingCard key={item._id} listing={item} />)}
            </div>
          </div>
        </div>

        <div className="sticky top-24 h-fit space-y-4">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
            <div className="space-y-2">
              <h3 className="font-display text-display-md text-text-primary">
                Interested in this property?
              </h3>
              <p className="text-body-sm text-text-muted">
                Chat directly with Eloike on WhatsApp or send an enquiry.
              </p>
            </div>

            <div className="mt-4 space-y-3 rounded-lg border border-border bg-surface-soft p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label text-text-muted">Price</p>
                  <PriceDisplay usdAmount={Number(listing.price || 0)} />
                </div>
                <span className="rounded-pill bg-primary px-3 py-1 text-label font-mono uppercase text-white">
                  {listing.type === "rent" ? "Rent" : "Sale"}
                </span>
              </div>
              <div className="text-body-sm text-text-muted line-clamp-2">
                {listing.description}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <WhatsAppButton
                size="lg"
                fullWidth
                label="Chat with Eloike on WhatsApp"
                href={buildListingWhatsAppLink(listing)}
              />
              <div className="flex items-center gap-2 text-label text-text-muted">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-text-primary transition hover:border-primary hover:text-primary"
                >
                  <Link2 size={16} />
                  Copy link
                </button>
                <a
                  href={whatsappShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-text-primary transition hover:border-primary hover:text-primary"
                >
                  <Share2 size={16} />
                  Share
                </a>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-display text-lg text-text-primary">
                Send an enquiry
              </h4>
              <form className="space-y-3" onSubmit={submitEnquiry}>
                <Input
                  label="Name"
                  name="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <label className="flex flex-col gap-2 text-label text-text-muted">
                  <span className="font-medium">Message</span>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    className="w-full rounded-md border border-border bg-surface px-4 py-3 text-body-md text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
                    placeholder="Hi Eloike, I'd like to know more about this property."
                  />
                </label>
                {formError && (
                  <p className="text-body-sm text-error">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-pill bg-primary px-5 py-3 text-body-md font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Sending..." : "Send Enquiry"}
                </button>
              </form>
            </div>

            <div className="mt-4 space-y-2 text-body-sm text-text-muted">
              {[
                "Verified listing",
                "Direct owner contact",
                "Transparent fees",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-label text-text-muted">Your Agent</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                EM
              </div>
              <div>
                <p className="font-semibold text-text-primary">
                  Eloike Maryann
                </p>
                <p className="text-label text-text-muted">
                  Real Estate & Insurance Advisor
                </p>
                <p className="font-mono text-label text-text-muted">
                  15 years industry experience
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] text-primary-dark">
                    AIICO Alumni
                  </span>
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] text-primary-dark">
                    AY Housing Alumni
                  </span>
                </div>
                <a
                  href={buildListingWhatsAppLink(listing)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-body-sm font-medium text-primary underline underline-offset-4"
                >
                  Chat now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-body-sm text-text-primary shadow-soft">
      {icon}
      <span>{label}</span>
    </div>
  );
}
