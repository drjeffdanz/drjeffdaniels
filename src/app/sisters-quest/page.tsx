import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Sisters' Quest: The Moonveil Crown | Dr. Jeff Daniels",
  description:
    "A King's Quest-style adventure game. Play as sisters Mackenzie and Cambrie on a quest to save their mother, Queen Elara of Elderwyn.",
  alternates: {
    canonical: "https://www.drjeffdaniels.com/sisters-quest",
  },
};

export default function SistersQuestPage() {
  return (
    <div className="flex flex-col h-screen bg-dark overflow-hidden">
      <Navigation />
      <main className="flex-1 pt-[73px]">
        <iframe
          src="/sisters-quest/index.html"
          title="Sisters' Quest: The Moonveil Crown"
          className="w-full h-full border-0"
          allow="autoplay"
        />
      </main>
    </div>
  );
}
