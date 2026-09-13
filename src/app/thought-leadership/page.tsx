import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PostCards from "@/components/PostCards";
import { publishedPosts } from "@/lib/posts";
export const metadata: Metadata = { title: "Thought Leadership", description: "Perspectives on emerging technology, strategic leadership, and digital transformation from Dr. Jeff Daniels.", alternates: { canonical: "/thought-leadership" } };
export default async function Page() {
  return <><Navigation /><main className="max-w-7xl mx-auto px-6 pt-36 pb-24 min-h-screen">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold">Thought Leadership</h1>
    <p className="text-light-text text-lg mb-16 max-w-2xl">Perspectives on emerging technology, strategic leadership, and the future of digital transformation.</p>
    <PostCards posts={await publishedPosts()} />
  </main><Footer /></>;
}
