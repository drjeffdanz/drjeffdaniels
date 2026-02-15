import { Award, Shield, Star } from "lucide-react";

const awards = [
  {
    title: "Dallas 500 Innovative Leaders",
    org: "D-CEO Magazine",
    icon: "star",
  },
  {
    title: "NOVA Award — Business Continuity and Resiliency",
    org: "Lockheed Martin",
    icon: "award",
  },
  {
    title: "Drazek Award for Teaching Excellence",
    org: "University",
    icon: "award",
  },
  {
    title: "Excellence Award — Intelligent Factory",
    org: "Lockheed Martin",
    icon: "award",
  },
  {
    title: "AeroStar Award — CodeQuest Student Programming Competition",
    org: "5-year volunteer, grew from 150 students in Texas to 843+ worldwide",
    icon: "star",
  },
  {
    title: "Enterprise Business Services Catalyst",
    org: "Top 10 catalyst leader for 4,000-person organization",
    icon: "star",
  },
  {
    title: "Lockheed Martin Excellence Award",
    org: "Transformed Aero IT engagement model with JSF/F-35 program",
    icon: "award",
  },
  {
    title: "Certified Chief Information Security Officer (C|CISO)",
    org: "EC-Council",
    icon: "shield",
  },
  {
    title: "Advanced Systems Architect, Cyber",
    org: "Top 1% of Lockheed Martin employees",
    icon: "shield",
  },
  {
    title: "IBM Champion Award Finalist",
    org: "Recognized innovative thought leader",
    icon: "star",
  },
  {
    title: "ACM Doctoral Dissertation Award Nominee",
    org: "Association of Computing and Machinery (National Award)",
    icon: "award",
  },
  {
    title: "ISE Central Award Project Nominee",
    org: "Information Security Executive (National Award)",
    icon: "shield",
  },
];

function IconForType({ type }: { type: string }) {
  switch (type) {
    case "shield":
      return <Shield className="text-gold" size={20} />;
    case "star":
      return <Star className="text-gold" size={20} />;
    default:
      return <Award className="text-gold" size={20} />;
  }
}

export default function Awards() {
  return (
    <section id="awards" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">Awards & Recognition</span>
        </h2>
        <p className="text-light-text text-lg mb-16 max-w-2xl">
          Recognized across the defense industry, academia, and technology
          community.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-colors duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <IconForType type={award.icon} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">
                    {award.title}
                  </h3>
                  <p className="text-light-text text-xs">{award.org}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
