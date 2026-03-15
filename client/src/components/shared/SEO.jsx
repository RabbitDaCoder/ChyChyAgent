import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "ChyChyAgent";
const SITE_URL = import.meta.env.VITE_SITE_URL;
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  schema,
  noIndex = false,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Real Estate & Insurance Nigeria`;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_NG" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ChyChyAgent" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">
          {Array.isArray(schema)
            ? JSON.stringify(schema)
            : JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  noIndex: PropTypes.bool,
};

export default SEO;
