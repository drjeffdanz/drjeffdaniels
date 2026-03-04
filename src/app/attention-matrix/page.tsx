import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Daniels Attention Matrix | Dr. Jeff Daniels",
  description:
    "A modern Eisenhower Matrix for executives — drag-and-drop task prioritization, AI-assisted categorization, and analytics. Built by Dr. Jeff Daniels.",
  alternates: {
    canonical: "https://www.drjeffdaniels.com/attention-matrix",
  },
};

export default function AttentionMatrixPage() {
  return (
    <div className="flex flex-col h-screen bg-dark overflow-hidden">
      <Navigation />
      <main className="flex-1 pt-[73px]">
        <iframe
          src="/attention-matrix/index.html"
          title="Daniels Attention Matrix"
          className="w-full h-full border-0"
          allow="clipboard-write"
        />
      </main>
    </div>
  );
}
