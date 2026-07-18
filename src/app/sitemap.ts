import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://venturamall.bo";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/#tiendas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/#experiencias`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#gastronomia`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#cine`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/#eventos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/#galeria`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#promociones`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/#visita`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/#faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
