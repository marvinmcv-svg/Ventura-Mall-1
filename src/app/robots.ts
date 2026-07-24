import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: "https://venturamall.bo/sitemap.xml",
    host: "https://venturamall.bo",
  };
}
