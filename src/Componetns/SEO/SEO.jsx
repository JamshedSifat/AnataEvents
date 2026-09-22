import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ananta Events";
const DEFAULT_DESC =
  "Ananta Events — leading event management company in Bangladesh. Corporate events, exhibitions, concerts, celebrity booking and luxury weddings.";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://ananta-events-jet.vercel.app";

/**
 * Unique title/description/OG tags per route. Admin pages pass noindex.
 */
const SEO = ({
  title,
  description = DEFAULT_DESC,
  image,
  path,
  noindex = false,
  type = "website",
}) => {
  const fullTitle = title ? `${title}` : `${SITE_NAME} | Best Event Management Company in Bangladesh`;
  const url = `${SITE_URL}${path || ""}`;
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
