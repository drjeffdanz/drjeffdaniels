import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Publications from "@/components/Publications";
import Blog from "@/components/Blog";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Publications />
        <Blog />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
