import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-[#1a1510]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,149,108,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,149,108,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-gold">Digital Transformation</span>
            <br />
            <span className="text-white">Leader &</span>
            <br />
            <span className="text-white">Professor</span>
          </h1>
          <p className="text-lg text-light-text max-w-lg mb-8 leading-relaxed">
            Program Director at Lockheed Martin. Professor of Cybersecurity at
            UMGC. Thought leader in AI, cloud computing, blockchain, and
            industrial innovation.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#about"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-dark font-semibold px-6 py-3 rounded-full transition-colors duration-300"
            >
              Learn More
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-dark font-semibold px-6 py-3 rounded-full transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Headshot photo */}
        <div className="hidden md:flex justify-center animate-fade-in-up animation-delay-400">
          <div className="w-80 h-80 rounded-full overflow-hidden border-2 border-gold/30 shadow-2xl shadow-gold/10">
            <Image
              src="/headshot.jpg"
              alt="Dr. Jeff Daniels"
              width={320}
              height={320}
              className="w-full h-full object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold animate-bounce"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
