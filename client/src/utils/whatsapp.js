export function buildListingWhatsAppLink(listing) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const features = listing.features || {};
  const location = listing.location || {};

  const message = [
    "Hello Eloike! 👋",
    "",
    "I'm interested in the following property:",
    "",
    `🏠 *${listing.title}*`,
    `📍 ${location.address || ""}, ${location.city || ""}, ${location.state || ""}`,
    `💰 ${listing.type === "sale" ? "For Sale" : "For Rent"}: $${listing.price?.toLocaleString()} USD`,
    `🛏 ${features.bedrooms || 0} bed  🚿 ${features.bathrooms || 0} bath  📐 ${features.sqm || 0}sqm`,
    "",
    `🔗 View listing: ${siteUrl}/listings/${listing.slug}`,
    "",
    "Please get in touch when available. Thank you!",
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildInsuranceWhatsAppLink(plan) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const features = plan.features || [];

  const message = [
    "Hello Eloike! 👋",
    "",
    "I'm interested in the following insurance plan:",
    "",
    `🛡️ *${plan.name}*`,
    `📋 Category: ${plan.category}`,
    `💰 Price: ${plan.price}`,
    "",
    "Features I'm interested in:",
    features.slice(0, 3).map((f) => `  ✓ ${f}`).join("\n"),
    "",
    `🔗 View plan: ${siteUrl}/insurance#${plan._id}`,
    "",
    "Please get in touch when available. Thank you!",
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
