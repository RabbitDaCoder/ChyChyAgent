import express from "express";
import Listing from "../models/Listing.model.js";
import Blog from "../models/Blog.model.js";

const router = express.Router();
const SITE_URL = process.env.CLIENT_URL;

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const [listings, blogs] = await Promise.all([
      Listing.find({ status: "available" }, "slug updatedAt").lean(),
      Blog.find({ status: "published" }, "slug updatedAt").lean(),
    ]);

    const staticPages = [
      { url: "/", priority: "1.0", freq: "daily" },
      { url: "/listings", priority: "0.9", freq: "daily" },
      { url: "/insurance", priority: "0.9", freq: "weekly" },
      { url: "/blog", priority: "0.8", freq: "daily" },
      { url: "/about", priority: "0.6", freq: "monthly" },
      { url: "/contact", priority: "0.6", freq: "monthly" },
    ];

    const listingUrls = listings.map((l) => ({
      url: `/listings/${l.slug}`,
      lastmod: l.updatedAt?.toISOString().split("T")[0],
      priority: "0.8",
      freq: "weekly",
    }));

    const blogUrls = blogs.map((b) => ({
      url: `/blog/${b.slug}`,
      lastmod: b.updatedAt?.toISOString().split("T")[0],
      priority: "0.7",
      freq: "weekly",
    }));

    const allUrls = [...staticPages, ...listingUrls, ...blogUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Sitemap generation failed");
  }
});

export default router;
