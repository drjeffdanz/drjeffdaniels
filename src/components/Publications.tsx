import { ExternalLink, FileText } from "lucide-react";

const publications = [
  {
    title: "Nowhere to Hide: Monitoring Side Channels for Supply Chain Resiliency",
    venue: "IEEE Reliability Magazine",
    year: "2024",
    publisher: "IEEE",
  },
  {
    title: "Professional Engineering Ethics, Risk, and Liability with Technology",
    venue: "NSPE Workability Wednesday (2023 Education Series)",
    year: "2023",
    publisher: "NSPE",
  },
  {
    title: "Building the Factory of the Future With the Industrial Internet of Things",
    venue: "IEEE",
    year: "2022",
    publisher: "IEEE",
  },
  {
    title: "Critical Steps in the Process for Data Analytics and Artificial Intelligence",
    venue: "IISE Annual Conference",
    year: "2021",
    publisher: "IISE",
  },
  {
    title: "Future of Data Analytics and AI in the Industrial Sector",
    venue: "IISE Annual Conference",
    year: "2021",
    publisher: "IISE",
  },
  {
    title: "Internet of Things in Business Transformation",
    venue: "Wiley (Book Chapter)",
    year: "2020",
    publisher: "Wiley",
  },
  {
    title: "Maynard Handbook for Industrial and Systems Engineering",
    venue: "IISE (Book Chapter)",
    year: "2020",
    publisher: "IISE",
  },
  {
    title: "New Intelligent Factory Network Comes to Life",
    venue: "Lockheed Martin",
    year: "2020",
    publisher: "Lockheed Martin",
  },
  {
    title: "The Impact of Right to be Forgotten on Deep Neural Networks",
    venue: "Research Publication",
    year: "2020",
    publisher: "Research Publication",
  },
  {
    title:
      "The Internet of Things, Artificial Intelligence, Blockchain, and Professionalism",
    venue: "IEEE IT Professional",
    year: "2019",
    publisher: "IEEE",
  },
];

// JSON-LD structured data for publications
const publicationsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Publications by Dr. Jeff Daniels",
  description:
    "Selected scholarly publications, articles, and presentations by Dr. Jeff Daniels, Ph.D.",
  author: {
    "@type": "Person",
    "@id": "https://www.drjeffdaniels.com/#person",
    name: "Jeff Daniels",
    honorificPrefix: "Dr.",
    honorificSuffix: "Ph.D.",
  },
  itemListElement: publications.map((pub, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "ScholarlyArticle",
      name: pub.title,
      author: {
        "@type": "Person",
        "@id": "https://www.drjeffdaniels.com/#person",
        name: "Jeff Daniels",
      },
      datePublished: pub.year,
      publisher: {
        "@type": "Organization",
        name: pub.publisher,
      },
      isPartOf: {
        "@type": "Periodical",
        name: pub.venue,
      },
    },
  })),
};

const links = [
  {
    label: "Google Scholar Publications",
    href: "https://scholar.google.com/citations?hl=en&view_op=list_works&gmla=AF9nlQvK-iqRYcijVNfqQ1Jpf9I3G9QSMg8Zh2MKvz5nTaIwKS9bhqZ-Vv8k7cinGBglgKJ18bYBp_NdBvdCFg&user=09YXKIQAAAAJ",
  },
  {
    label: "ACM Author Page",
    href: "https://dl.acm.org/profile/81443592664",
  },
  {
    label: "Sycamore Scholars Doctoral Dissertation",
    href: "https://scholars.indstate.edu",
  },
];

export default function Publications() {
  return (
    <section id="publications" className="py-24 border-t border-dark-border">
      {/* ScholarlyArticle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(publicationsSchema) }}
      />
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
