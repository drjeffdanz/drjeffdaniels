import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Publications from "@/components/Publications";
import AdvisoryBoard from "@/components/AdvisoryBoard";
import Awards from "@/components/Awards";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ThoughtLeadership from "@/components/ThoughtLeadership";
import FreeTools from "@/components/FreeTools";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Publications />
        <AdvisoryBoard />
        <Awards />
        <Resume />
        <ThoughtLeadership />
        <FreeTools />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
