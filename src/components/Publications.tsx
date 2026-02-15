import { ExternalLink, FileText } from "lucide-react";

const publications = [
  {
    title:
      "How Digital Strategy has become a Competitive and Disruptive Technology",
    venue: "University of Houston Conference on AI, Cybersecurity, Blockchain, IOT, and Cloud Technology",
    year: "2017",
  },
  {
    title: "Digital Workforce Succession in Manufacturing",
    venue: "Digital Manufacturing and Design Innovation Institute",
    year: "2017",
  },
  {
    title: "Blockchain Technology Innovations",
    venue:
      "Lockheed Martin Journal of Software Engineering / Journal of Systems Engineering and Architecture",
    year: "2017",
  },
  {
    title: "Blockchain Technology Adoption in the Supply Chain",
    venue: "IISE Annual Conference and Expo",
    year: "2017",
  },
  {
    title: "Emergence of Blockchain Technology",
    venue: "IEEE Technology and Engineering Management Society, TEMSCON",
    year: "2017",
  },
  {
    title: "Industry 4.0, Internet of Things, and Digital Tapestry",
    venue: "International Management of Technology / IMOT",
    year: "2016",
  },
  {
    title:
      "Industrial Control System Applications go Mobile in the Cloud",
    venue: "IEEE MetroCon Conference Proceedings",
    year: "2015",
  },
  {
    title:
      "Federal Technology Convergence Commission Report: Building a Smarter Nation",
    venue: "Creating IT Futures Foundation",
    year: "2015",
  },
  {
    title:
      "Assured Identity for the Cloud — World's First Doctoral Dissertation on Cloud Computing & Cybersecurity",
    venue: "Doctoral Dissertation, Indiana State University",
    year: "2011",
  },
];

const links = [
  { label: "Google Scholar Publications", href: "https://scholar.google.com" },
  { label: "ACM Author Page", href: "https://dl.acm.org" },
  {
    label: "Sycamore Scholars Doctoral Dissertation",
    href: "https://scholars.indstate.edu",
  },
];

export default function Publications() {
  return (
    <section id="publications" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">Publications & Speaking</span>
        </h2>
        <p className="text-light-text text-lg mb-8 max-w-2xl">
          Selected publications, articles, and presentations in technology,
          cybersecurity, and digital transformation.
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap gap-4 mb-16">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-dark-card border border-dark-border hover:border-gold/50 rounded-full px-5 py-2.5 text-sm text-gold transition-colors duration-300"
            >
              <ExternalLink size={14} />
              {link.label}
            </a>
          ))}
        </div>

        {/* Publications list */}
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-gold/30 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <FileText
                  className="text-gold shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h3 className="text-white font-medium mb-1">{pub.title}</h3>
                  <p className="text-light-text text-sm">
                    {pub.venue} &middot; {pub.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
