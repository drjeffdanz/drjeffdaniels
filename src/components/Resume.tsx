import { Download, Briefcase, GraduationCap, Users } from "lucide-react";

const experience = [
  {
    company: "AI, Automation, and Digital Infrastructure Lead",
    location: "Fort Worth, TX",
    period: "2019 – Present",
    title: "Program Director",
    description:
      "Technology Office executive responsible for strategic oversight of digital services consisting of traditional and digital platforms. Partner with cross-functional teams to direct data-driven strategies for a $6B+ transformational initiative.",
    highlights: [
      "Directed enterprise-wide digital transformation for $6B+ initiative, delivering $503M in automation savings and 30% spending reductions.",
      "Built and led 200+ person global technology organization managing $90M budget (<1% variance) and 100+ applications.",
      "Developed Intelligent Factory Framework integrating Generative AI, IoT, and cloud platforms.",
      "Launched enterprise citizen innovation program, certifying 600+ innovators and growing patent portfolio.",
    ],
  },
  {
    company: "Application Services",
    location: "Fort Worth, TX",
    period: "2014 – 2019",
    title: "Senior Manager, Application Services",
    description:
      "Portfolio management for Aeronautics Strategic Business including shared services, quality systems, configuration management, DevOps, test automation, agile program management, and hybrid cloud computing. Managed $12M budget.",
    highlights: [
      "Designed and implemented first Hyperledger Blockchain instance for LM centered on DevOps methodologies.",
      "Created strategic roadmap for cross-functional lines of business to prioritize program funding.",
      "Reduced F-35 aircraft sustainment cycle time from 20 days to 3 days.",
      "Strategic driver for cloud computing initiative — Digital Tapestry (IoT) and Automation capabilities.",
    ],
  },
  {
    company: "Prior Professional Roles",
    location: "Orlando, FL",
    period: "Pre-2014",
    title: "Individual Contributor",
    description:
      "Served as Chief Engineer, systems architect, and performance computing lead on external-facing B2B services, SaaS, Identity Management, and Cybersecurity services. Program deployments across F-35, C-130J, C-5, F-22, F-16, JASSM, NRO, SPO, and ADP.",
    highlights: [],
  },
];

const competencies = {
  Strategic: [
    "Organizational Vision & Strategy",
    "Corporate Governance",
    "Transformational Change",
    "Metrics / KPIs / OKRs",
    "Board of Directors Engagement",
    "Risk Management",
    "Active Secret Clearance",
  ],
  "Emerging Technology": [
    "Generative AI / LLM / MCP / Agentic",
    "Hybrid Cloud (AWS / Azure / GCP)",
    "IoT / Industrial IoT",
    "GitLab, DevOps, Jira, Atlassian",
    "ServiceNow, Digital Ledger",
    "Anthropic, OpenAI",
    "Growth Mindset & Innovation",
  ],
  "Leadership & Governance": [
    "IT Governance",
    "Cybersecurity, Security+",
    "Metrics-driven Performance",
    "Budget & Schedule Management",
    "Process Modeling / Mining",
    "Open Source & Supply Chain",
    "Relationship Management",
  ],
};

const education = [
  { school: "Indiana State University", degree: "PhD, Cloud Computing & Digital Communications" },
  { school: "Rensselaer Polytechnic Institute", degree: "MS, Management of Technology" },
  { school: "University of Central Florida", degree: "BS, Computer Science & MIS" },
  { school: "IMD", degree: "Executive Digital Transformation Program" },
  { school: "Columbia University", degree: "Executive Strategy Program" },
];

export default function Resume() {
  return (
    <section id="resume" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gold">Resume</span>
            </h2>
            <p className="text-light-text text-lg max-w-2xl">
              15+ years driving enterprise digital transformation across aerospace, defense,
              and complex manufacturing environments.
            </p>
          </div>
          <a
            href="/Daniels-Resume-2Q26.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-dark font-semibold px-6 py-3 rounded-full transition-colors duration-300 shrink-0"
          >
            <Download size={18} />
            Download PDF
          </a>
        </div>

        {/* Experience */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="text-gold" size={24} />
            <h3 className="text-2xl font-bold text-white">Professional Experience</h3>
          </div>
          <div className="space-y-6">
            {experience.map((role, i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                  <h4 className="text-white font-semibold text-lg">{role.company}</h4>
                  <span className="text-gold text-sm font-medium shrink-0">{role.period}</span>
                </div>
                <p className="text-light-text text-sm mb-1">{role.location}</p>
                <p className="text-gold text-sm font-medium mb-3">{role.title}</p>
                <p className="text-light-text text-sm leading-relaxed mb-4">{role.description}</p>
                {role.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {role.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-light-text text-sm">
                        <span className="text-gold mt-1.5 shrink-0">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Signature Competencies */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-gold" size={24} />
            <h3 className="text-2xl font-bold text-white">Signature Competencies</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(competencies).map(([category, skills]) => (
              <div key={category} className="bg-dark-card border border-dark-border rounded-xl p-6">
                <h4 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">{category}</h4>
                <ul className="space-y-2">
                  {skills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-light-text text-sm">
                      <span className="text-gold mt-1 shrink-0">▸</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="text-gold" size={24} />
            <h3 className="text-2xl font-bold text-white">Education & Professional Development</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {education.map((ed, i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-5">
                <p className="text-white font-semibold text-sm mb-1">{ed.school}</p>
                <p className="text-light-text text-sm">{ed.degree}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
