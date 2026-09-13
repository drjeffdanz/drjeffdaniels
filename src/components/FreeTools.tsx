import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { freeTools } from "@/lib/free-tools";

export function FreeToolCards() {
  return <div className="grid sm:grid-cols-2 gap-6">{freeTools.map(tool => (
    <Link href={`/free-tools/${tool.slug}`} key={tool.slug} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-gold/30 transition-colors duration-300 group">
      <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-gold">{tool.title}</h3>
      <p className="text-light-text leading-relaxed mb-5">{tool.description}</p>
      <span className="inline-flex items-center gap-2 text-gold text-sm">Open worksheet <ArrowRight size={14} /></span>
    </Link>
  ))}</div>;
}
export default function FreeTools() {
  return <section id="free-tools" className="py-24 border-t border-dark-border"><div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gold">Resource Library</h2>
    <p className="text-light-text text-lg mb-16 max-w-2xl">Practical worksheets to clarify your purpose, shape your career, and turn transformation goals into action.</p>
    <FreeToolCards />
  </div></section>;
}
