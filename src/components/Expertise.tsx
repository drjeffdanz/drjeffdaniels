import { CheckCircle } from "lucide-react";

const firsts = [
  "First AWS Partner to deploy GreenGrass/IOT Core on GovCloud",
  "Deployed the Defense Industry's first Intelligent Factory",
  "Designed & implemented first Blockchain electronic ledger for Lockheed Martin and industrial base",
  "Designed & implemented the defense industry's first Hybrid Product Support Integration (HPSI) facility",
  "Published the first doctoral dissertation on cloud computing",
  "Deployed first x86 virtualization systems for Lockheed Martin",
  "Designed Lockheed Martin's first Internet-facing portal in support of the National Reconnaissance Office",
  "Implemented the largest Microsoft Exchange deployment ever",
];

const topics = [
  "Cloud Computing",
  "Artificial Intelligence",
  "Machine Learning",
  "Quantum Computing",
  "Blockchain",
  "Cybersecurity",
  "Industrial IoT",
  "Digital Transformation",
];

export default function Expertise() {
  return (
    <section id="expertise" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">Expertise & Innovation</span>
        </h2>
        <p className="text-light-text text-lg mb-16 max-w-2xl">
          A catalyst in the aerospace and defense industry, known for a series
          of innovative firsts.
        </p>

        {/* Topics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {topics.map((topic) => (
            <div
              key={topic}
              className="bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-center text-sm font-medium text-white hover:border-gold/50 transition-colors duration-300"
            >
              {topic}
            </div>
          ))}
        </div>

        {/* Industry Firsts */}
        <h3 className="text-2xl font-bold text-white mb-8">Industry Firsts</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {firsts.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-dark-card border border-dark-border rounded-lg p-5"
            >
              <CheckCircle
                className="text-gold shrink-0 mt-0.5"
                size={20}
              />
              <span className="text-light-text text-sm leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
