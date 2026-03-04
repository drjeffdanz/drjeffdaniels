import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.drjeffdaniels.com";
  const lastModified = new Date();

  // Single-page site — only include the root URL.
  // Hash anchors (#about, #resume, etc.) are not valid sitemap URLs
  // and will cause Google Search Console to reject the sitemap.
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/attention-matrix`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
