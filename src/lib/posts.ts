import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";

export const reader = createReader(process.cwd(), config);

export async function publishedPosts() {
  const posts = await reader.collections.posts.all();
  return posts.filter(post => post.entry.status === "published")
    .sort((a, b) => (b.entry.date ?? "").localeCompare(a.entry.date ?? "") || a.slug.localeCompare(b.slug));
}

export function articleDate(date: string | null) {
  return date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)) : "";
}
