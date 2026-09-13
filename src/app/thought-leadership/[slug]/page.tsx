import type { Metadata } from "next";
import React from "react";
import Markdoc from "@markdoc/markdoc";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { reader, publishedPosts, articleDate } from "@/lib/posts";

export const dynamicParams = false;
export async function generateStaticParams() { return (await publishedPosts()).map(({ slug }) => ({ slug })); }
async function getPost(slug: string) {
  const post = await reader.collections.posts.read(slug);
  if (!post || post.status !== "published") notFound();
  return post;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/thought-leadership/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: `/thought-leadership/${slug}` } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  const { node } = await post.content();
  const content = Markdoc.transform(node);
  return <><Navigation /><main className="max-w-3xl mx-auto px-6 pt-36 pb-24 min-h-screen">
    <Link href="/thought-leadership" className="text-gold text-sm">← Thought Leadership</Link>
    <article className="mt-8">
      <time dateTime={post.date ?? undefined} className="text-sm text-light-text">{articleDate(post.date)}</time>
      <h1 className="text-4xl md:text-5xl font-bold text-gold mt-4 mb-6 leading-tight">{post.title}</h1>
      <p className="text-xl text-light-text leading-relaxed mb-6">{post.excerpt}</p>
      <p className="text-sm text-light-text mb-10">Dr. Jeff Daniels</p>
      <div className="article-content">{Markdoc.renderers.react(content, React)}</div>
    </article>
  </main><Footer /></>;
}
