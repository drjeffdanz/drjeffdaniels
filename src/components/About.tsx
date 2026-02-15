import { GraduationCap, Briefcase, BookOpen } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">About</span>
        </h2>
        <p className="text-light-text text-lg mb-16 max-w-2xl">
          Technology, Leadership, Management
        </p>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-light-text leading-relaxed mb-6">
              My name is Jeff Daniels. I am a program director leader at
              Lockheed Martin. I am responsible for corporate strategy with a
              focus on disruptive technology and global technology trends. I
              enjoy researching and writing about emerging technology.
            </p>
            <p className="text-light-text leading-relaxed mb-6">
              My main interests are cloud computing, artificial intelligence,
              machine learning, quantum computing, industrial manufacturing and
              automation, and cybersecurity.
            </p>
            <p className="text-light-text leading-relaxed">
              I have a Ph.D. in Computer Science/Technology Management and my
              dissertation was the first on cloud computing and cybersecurity;
              specifically how we manage identities in cloud computing
              environments and traditional physical locations.
            </p>
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
