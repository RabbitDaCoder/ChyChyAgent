const SITE_URL = import.meta.env.VITE_SITE_URL;
const ORG_NAME = "ChyChyAgent";

export function buildOrgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: ORG_NAME,
    description:
      "Nigerian real estate and insurance agency helping clients find properties and insurance plans.",
    url: SITE_URL,
    telephone: import.meta.env.VITE_WHATSAPP_NUMBER,
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
    founder: {
      "@type": "Person",
      name: "Eloike Maryann",
    },
    sameAs: [],
  };
}

export function buildListingSchema(listing) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description,
    url: `${SITE_URL}/listings/${listing.slug}`,
    image: listing.images,
    datePosted: listing.createdAt,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "USD",
      availability:
        listing.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.location.address,
      addressLocality: listing.location.city,
      addressRegion: listing.location.state,
      addressCountry: "NG",
    },
    numberOfRooms: listing.features.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.features.sqm,
      unitCode: "MTK",
    },
    ...(listing.type === "rent" && {
      leaseLength: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: "ANN",
      },
    }),
  };
}

export function buildInsuranceSchema(plan) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: plan.description,
    brand: {
      "@type": "Brand",
      name: ORG_NAME,
    },
    category: `Insurance — ${plan.category}`,
    offers: {
      "@type": "Offer",
      price: plan.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: ORG_NAME,
      },
    },
  };
}

export function buildBreadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  };
}
