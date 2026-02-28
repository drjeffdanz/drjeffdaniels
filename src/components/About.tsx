import { GraduationCap, Briefcase, BookOpen, Target, ExternalLink } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">About</span>
        </h2>
        <p className="text-light-text text-lg mb-4 max-w-3xl">
          Senior Executive Program Director
        </p>
        <div className="flex flex-wrap gap-3 mb-16">
          {[
            "Strategy & Operations",
            "Digital Leadership",
            "Portfolio Execution",
          ].map((tag) => (
            <span
              key={tag}
              className="bg-dark-card border border-dark-border rounded-full px-4 py-1.5 text-sm text-gold"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-light-text leading-relaxed mb-6">
              Visionary technology executive with 15+ years leading enterprise
              digital transformation in aerospace/defense and complex
              manufacturing environments. Proven in aligning IT/digital
              strategies with business objectives, delivering $500M+ in
              automation efficiencies, managing $90M+ budgets, and building
              high-performance teams of 200+. Expertise in emerging technologies
              (Generative AI, IoT, cloud) to drive innovation, cybersecurity,
              and operational excellence. Active Secret Clearance holder adept at
              navigating VUCA environments and partnering with C-suite
              stakeholders for sustainable growth.
            </p>

            <a
              href="https://grokipedia.com/page/Jeff_Daniels_technology_executive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-dark-card border border-dark-border hover:border-gold/50 rounded-full px-5 py-2.5 text-sm text-gold transition-colors duration-300 mb-6"
            >
              <ExternalLink size={14} />
              Grokipedia Profile
            </a>

            <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Target className="text-gold" size={24} />
                <h3 className="text-lg font-semibold text-white">
                  Full-Spectrum Leadership
                </h3>
              </div>
              <p className="text-light-text text-sm leading-relaxed mb-4">
                Command and leadership experience spanning software development,
                business transformation, government, education, manufacturing
                and industrial, semiconductor, robotics, IT, &amp; automation
                industries.
              </p>
              <p className="text-light-text text-sm leading-relaxed mb-4">
                Award-winning customer experience and service with track record
                of delivering tangible results in highly-volatile uncertain,
                complex, and ambiguous (VUCA) situations. Serve as a mentor to
                high-performing teams centered on business outcomes for digital
                business and transformational strategies.
              </p>
              <p className="text-light-text text-sm leading-relaxed">
                High-energy, hands-on executive with executive presence, C-suite
                competencies, and a history of optimizing organizational
                performance and savings in operational governance, automation,
                and business strategy leadership roles for start-ups, small and
                midsize businesses, and large enterprises.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="text-gold" size={24} />
                <h3 className="text-lg font-semibold text-white">Education</h3>
              </div>
              <ul className="space-y-2 text-light-text text-sm">
                <li>
                  <span className="text-white font-medium">
                    Indiana State University
                  </span>{" "}
                  — Doctor of Philosophy, Management of Technology
                </li>
                <li>
                  <span className="text-white font-medium">
                    Rensselaer Polytechnic Institute
                  </span>{" "}
                  — M.S., Technology Management
                </li>
                <li>
                  <span className="text-white font-medium">
                    University of Central Florida
                  </span>{" "}
                  — B.S., Computer Science
                </li>
                <li>
                  <span className="text-white font-medium">
                    International Institute for Management Development (IMD)
                  </span>{" "}
                  — Executive Program in Digital and Business Transformation
                </li>
                <li>
                  <span className="text-white font-medium">
                    Columbia University
                  </span>{" "}
                  — Strategy Executive Program
                </li>
              </ul>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="text-gold" size={24} />
                <h3 className="text-lg font-semibold text-white">Teaching</h3>
              </div>
              <ul className="space-y-2 text-light-text text-sm">
                <li>
                  <span className="text-white font-medium">
                    University of Maryland Global College
                  </span>{" "}
                  — Professor, Graduate School of Technology
                </li>
                <li>
                  <span className="text-white font-medium">
                    Florida Southern College
                  </span>{" "}
                  — Lecturer, Management Information Systems
                </li>
                <li>
                  <span className="text-white font-medium">
                    University of Central Florida
                  </span>{" "}
                  — Lecturer, Management Information Systems
                </li>
              </ul>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="text-gold" size={24} />
                <h3 className="text-lg font-semibold text-white">Leadership</h3>
              </div>
              <ul className="space-y-2 text-light-text text-sm">
                <li>Senior Member, Association of Computing & Machinery</li>
                <li>
                  Appointed LM ACM Liaison, Corporate Engineering & Technology
                  Office
                </li>
                <li>
                  Tech America Committee on Technology Convergence, White House
                  Office of Science and Technology
                </li>
                <li>Forbes Technology Council, Member</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
