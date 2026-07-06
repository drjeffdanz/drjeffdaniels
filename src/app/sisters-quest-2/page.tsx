import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Sisters' Quest II: The Moonbeam Mystery | Dr. Jeff Daniels",
  description:
    "A 3D King's Quest-style adventure game and sequel to The Moonveil Crown. Swap between sisters Mackenzie and Cambrie to unravel why the moonlight over Elderwyn has gone crooked.",
  alternates: {
    canonical: "https://www.drjeffdaniels.com/sisters-quest-2",
  },
};

export default function SistersQuest2Page() {
  return (
    <div className="flex flex-col h-screen bg-dark overflow-hidden">
      <Navigation />
      <main className="flex-1 pt-[73px]">
        <iframe
          src="/sisters-quest-2/index.html"
          title="Sisters' Quest II: The Moonbeam Mystery"
          className="w-full h-full border-0"
          allow="autoplay"
        />
      </main>
    </div>
  );
}
