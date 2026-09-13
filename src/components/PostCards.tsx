import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { articleDate, publishedPosts } from "@/lib/posts";

export default function PostCards({ posts }: { posts: Awaited<ReturnType<typeof publishedPosts>> }) {
  if (!posts.length) return <div className="bg-dark-card border border-dark-border rounded-xl p-8">
    <h3 className="text-white text-xl font-semibold mb-3">New perspectives, coming soon</h3>
    <p className="text-light-text leading-relaxed">Explore upcoming articles on technology, leadership, and digital transformation.</p>
  </div>;
  return <div className="grid md:grid-cols-3 gap-6">{posts.map(({ slug, entry }) => (
    <article key={slug} className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col hover:border-gold/30 transition-colors duration-300">
      <time dateTime={entry.date ?? undefined} className="flex items-center gap-2 text-light-text text-xs mb-4"><Calendar size={14} className="text-gold" />{articleDate(entry.date)}</time>
      <h3 className="text-white font-semibold text-lg mb-3"><Link href={`/thought-leadership/${slug}`} className="hover:text-gold">{entry.title}</Link></h3>
      <p className="text-light-text text-sm leading-relaxed mb-5 flex-grow">{entry.excerpt}</p>
      <div className="flex flex-wrap gap-2 mb-5">{entry.topics.map((topic, i) => <span key={i} className="bg-dark border border-dark-border rounded-full px-2.5 py-0.5 text-xs text-gold/80">{topic}</span>)}</div>
      <Link href={`/thought-leadership/${slug}`} className="inline-flex items-center gap-2 text-gold text-sm font-medium">Read article <ArrowRight size={14} /><span className="sr-only">: {entry.title}</span></Link>
    </article>
  ))}</div>;
}
