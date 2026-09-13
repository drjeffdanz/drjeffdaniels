import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Jeffasketch",
  description: "Two knobs. One continuous line. Play Jeff A Sketch, a nostalgic drawing game with free drawing and tracing challenges.",
  alternates: { canonical: "/jeffasketch" },
};

export default function JeffasketchPage() {
  return (
    <div className="flex flex-col h-dvh bg-dark">
      <Navigation />
      <main className="flex-1 min-h-0 pt-[73px]">
        <iframe src="/jeffasketch/index.html" title="Jeff A Sketch drawing game" className="w-full h-full border-0" />
      </main>
    </div>
  );
}
