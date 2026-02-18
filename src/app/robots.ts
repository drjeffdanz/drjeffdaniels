import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: "https://www.drjeffdaniels.com/sitemap.xml",
    host: "https://www.drjeffdaniels.com",
  };
}
