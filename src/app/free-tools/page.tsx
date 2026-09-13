import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FreeToolCards } from "@/components/FreeTools";
export const metadata: Metadata = { title: "Resource Library", description: "Free guided worksheets for mission, career vision, transformation objectives, and career planning.", alternates: { canonical: "/free-tools" } };
export default function Page() {
  return <><Navigation /><main className="max-w-7xl mx-auto px-6 pt-36 pb-24 min-h-screen">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold">Resource Library</h1>
    <p className="text-light-text text-lg mb-16 max-w-2xl">Practical worksheets to clarify your purpose, shape your career, and turn transformation goals into action. Fill them in and download your answers to keep.</p>
    <FreeToolCards />
  </main><Footer /></>;
}
