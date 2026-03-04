import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Technology Radar | Dr. Jeff Daniels",
  description:
    "Dr. Jeff Daniels' personal technology radar — tracking adoption of languages, frameworks, platforms, and techniques in AI, cloud, and enterprise engineering.",
  alternates: {
    canonical: "https://www.drjeffdaniels.com/tech-radar",
  },
};

export default function TechRadarPage() {
  return (
    <div className="flex flex-col h-screen bg-dark overflow-hidden">
      <Navigation />
      <main className="flex-1 pt-[73px]">
        <iframe
          src="https://drjeffdanz.github.io/tech-radar/"
          title="Dr. Jeff Daniels Technology Radar"
          className="w-full h-full border-0"
        />
      </main>
    </div>
  );
}
