import { Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "2022 Books in Review",
    excerpt:
      "A look back at the year's reading highlights, from the Goodreads annual Reading Challenge to curated lists across technology, leadership, and innovation.",
    date: "December 2022",
    tags: ["Books", "Reading", "Review"],
  },
  {
    title: "Top 10 Thought Leader — Thinkers360",
    excerpt:
      "Recognized as a Top 10 Thought Leader across blockchain, cloud, IoT, AI, AI Ethics, digital, cyber, and 5G by Thinkers360.",
    date: "2022",
    tags: ["AI", "Blockchain", "Cloud", "Cybersecurity"],
  },
  {
    title: "Industry 4.0 and the Intelligent Factory",
    excerpt:
      "How digital strategy, IoT, and cloud computing are transforming manufacturing and defense operations for the next generation.",
    date: "2021",
    tags: ["Industry 4.0", "IoT", "Digital Transformation"],
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">Blog & Insights</span>
        </h2>
        <p className="text-light-text text-lg mb-16 max-w-2xl">
          Thoughts on emerging technology, leadership, and the future of digital
          transformation.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col hover:border-gold/30 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-2 text-light-text text-xs mb-4">
                <Calendar size={14} className="text-gold" />
                {post.date}
              </div>
              <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-gold transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-light-text text-sm leading-relaxed mb-5 flex-grow">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-dark border border-dark-border rounded-full px-2.5 py-0.5 text-xs text-gold/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all duration-300">
                Read More <ArrowRight size={14} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
