import Link from "next/link";
import PostCards from "./PostCards";
import { publishedPosts } from "@/lib/posts";
export default async function ThoughtLeadership() {
  const posts = await publishedPosts();
  return <section id="thought-leadership" className="py-24 border-t border-dark-border">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gold">Thought Leadership</h2>
      <p className="text-light-text text-lg mb-10 max-w-2xl">Perspectives on emerging technology, strategic leadership, and the future of digital transformation.</p>
      <PostCards posts={posts.slice(0, 3)} />
      <Link href="/thought-leadership" className="inline-flex mt-8 text-gold hover:text-gold-light">Explore Thought Leadership →</Link>
    </div>
  </section>;
}
