import type { MetadataRoute } from "next";
import { publishedPosts } from "@/lib/posts";
import { freeTools } from "@/lib/free-tools";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.drjeffdaniels.com";
  const lastModified = new Date();

  const posts = await publishedPosts();
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
    ...["tech-radar", "zork", "sisters-quest", "jeffasketch", "defense-ai-brief", "thought-leadership", "free-tools", ...freeTools.map(tool => `free-tools/${tool.slug}`), ...posts.map(post => `thought-leadership/${post.slug}`)].map(path => ({ url: `${baseUrl}/${path}`, lastModified })),
  ];
}
