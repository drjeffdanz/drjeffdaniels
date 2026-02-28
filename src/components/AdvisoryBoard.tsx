import { Users } from "lucide-react";

const boardPositions = [
  {
    role: "Research Advisor",
    org: "Florida Institute of National Security (FINS)",
  },
  {
    role: "Board Member",
    org: "Operations Science Institute",
  },
  {
    role: "Advisory Board Member",
    org: "University of Central Florida",
  },
  {
    role: "Board Member",
    org: "Robert Morris University",
  },
];

export default function AdvisoryBoard() {
  return (
    <section id="advisory-board" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">Advisory Board</span>
        </h2>
        <p className="text-light-text text-lg mb-16 max-w-2xl">
          Serving on advisory and research boards across national security,
          academia, and industry.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {boardPositions.map((position, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-gold/30 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <Users className="text-gold shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-white font-medium mb-1">
                    {position.org}
                  </h3>
                  <p className="text-light-text text-sm">{position.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
