import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Worksheet from "@/components/Worksheet";
import { freeTools } from "@/lib/free-tools";
export function generateStaticParams() { return freeTools.map(({ slug }) => ({ slug })); }
function getTool(slug: string) { const tool = freeTools.find(tool => tool.slug === slug); if (!tool) notFound(); return tool; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tool = getTool((await params).slug);
  return { title: tool.title, description: tool.description, alternates: { canonical: `/free-tools/${tool.slug}` } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getTool((await params).slug);
  return <><Navigation /><main className="max-w-3xl mx-auto px-6 pt-36 pb-24">
    <Link href="/free-tools" className="text-gold text-sm">← Resource Library</Link>
    <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-4 text-gold">{tool.title}</h1>
    <p className="text-light-text text-lg leading-relaxed mb-8">{tool.introduction}</p>
    <Worksheet key={tool.slug} tool={tool} />
  </main><Footer /></>;
}
