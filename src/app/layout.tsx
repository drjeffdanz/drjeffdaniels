import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.drjeffdaniels.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Jeff Daniels | Technology Executive & Digital Transformation Leader",
    template: "%s | Dr. Jeff Daniels",
  },
  description:
    "Dr. Jeff Daniels, Ph.D. — Senior Executive Program Director at Lockheed Martin, Professor of Cybersecurity at UMGC. Expert in AI, cloud computing, blockchain, IoT, and enterprise digital transformation.",
  keywords: [
    "Dr. Jeff Daniels",
    "Jeff Daniels PhD",
    "Jeffrey Daniels technology executive",
    "Dr. Jeff Daniels Lockheed Martin",
    "Dr. Jeff Daniels cybersecurity",
    "Dr. Jeff Daniels digital transformation",
    "Dr. Jeff Daniels UMGC",
    "Dr. Jeff Daniels AI",
    "digital transformation leader",
    "technology executive aerospace defense",
    "generative AI enterprise",
    "intelligent factory",
    "IoT cloud computing",
    "cybersecurity professor",
    "Lockheed Martin digital transformation",
    "Jeff Daniels PhD technology",
  ],
  authors: [{ name: "Dr. Jeff Daniels", url: siteUrl }],
  creator: "Dr. Jeff Daniels",
  publisher: "Dr. Jeff Daniels",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: siteUrl,
    siteName: "Dr. Jeff Daniels",
    title: "Dr. Jeff Daniels | Technology Executive & Digital Transformation Leader",
    description:
      "Dr. Jeff Daniels, Ph.D. — Senior Executive Program Director at Lockheed Martin, Professor of Cybersecurity at UMGC. Expert in AI, cloud computing, blockchain, IoT, and enterprise digital transformation.",
    images: [
      {
        url: "/headshot.jpg",
        width: 320,
        height: 320,
        alt: "Dr. Jeff Daniels — Technology Executive",
      },
    ],
    firstName: "Jeff",
    lastName: "Daniels",
    username: "drjeffdaniels",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Jeff Daniels | Technology Executive & Digital Transformation Leader",
    description:
      "Senior Executive Program Director at Lockheed Martin. Professor of Cybersecurity at UMGC. Expert in AI, cloud computing, blockchain, and digital transformation.",
    images: ["/headshot.jpg"],
    creator: "@drjeffdaniels",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

// JSON-LD structured data — Person schema for Google Knowledge Graph
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Jeff Daniels",
  alternateName: ["Dr. Jeff Daniels", "Jeffrey Daniels", "Jeff Daniels PhD"],
  honorificPrefix: "Dr.",
  honorificSuffix: "Ph.D.",
  jobTitle: "Senior Executive Program Director",
  description:
    "Visionary technology executive with 15+ years leading enterprise digital transformation in aerospace and defense. Program Director at Lockheed Martin, Professor of Cybersecurity at UMGC, and published researcher in AI, IoT, and cloud computing.",
  url: siteUrl,
  image: {
    "@type": "ImageObject",
    url: `${siteUrl}/headshot.jpg`,
    contentUrl: `${siteUrl}/headshot.jpg`,
    caption: "Dr. Jeff Daniels — Technology Executive",
  },
  worksFor: {
    "@type": "Organization",
    name: "Lockheed Martin",
    url: "https://www.lockheedmartin.com",
    sameAs: "https://www.wikidata.org/wiki/Q210853",
  },
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "Senior Executive Program Director",
      occupationLocation: {
        "@type": "City",
        name: "Fort Worth, Texas",
      },
    },
    {
      "@type": "Occupation",
      name: "Professor of Cybersecurity",
      occupationLocation: {
        "@type": "Organization",
        name: "University of Maryland Global Campus",
        url: "https://www.umgc.edu",
      },
    },
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Indiana State University",
      url: "https://www.indstate.edu",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Rensselaer Polytechnic Institute",
      url: "https://www.rpi.edu",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "University of Central Florida",
      url: "https://www.ucf.edu",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "IMD Business School",
      url: "https://www.imd.org",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Columbia University",
      url: "https://www.columbia.edu",
    },
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Generative AI",
    "Machine Learning",
    "Cloud Computing",
    "Cybersecurity",
    "Blockchain",
    "Industrial IoT",
    "Digital Transformation",
    "Quantum Computing",
    "Robotic Process Automation",
    "Enterprise Technology Strategy",
    "Aerospace and Defense Technology",
  ],
  memberOf: [
    {
      "@type": "Organization",
      name: "Association for Computing Machinery",
      url: "https://www.acm.org",
    },
    {
      "@type": "Organization",
      name: "Forbes Technology Council",
      url: "https://councils.forbes.com/forbestechcouncil",
    },
    {
      "@type": "Organization",
      name: "IEEE",
      url: "https://www.ieee.org",
    },
  ],
  award: [
    "Dallas 500 Technology Leader",
    "NOVA Award — Lockheed Martin",
    "Pat Kelly Award for Innovation",
  ],
  sameAs: [
    "https://www.linkedin.com/in/jeffdaniels/",
    "https://www.thinkers360.com/tl/jeffdaniels",
    "https://www.researchgate.net/profile/Jeff-Daniels-2",
    "https://opscience.org/about-us/jeff-daniels/",
    "https://scholar.google.com/citations?hl=en&view_op=list_works&gmla=AF9nlQvK-iqRYcijVNfqQ1Jpf9I3G9QSMg8Zh2MKvz5nTaIwKS9bhqZ-Vv8k7cinGBglgKJ18bYBp_NdBvdCFg&user=09YXKIQAAAAJ",
    "https://dl.acm.org/profile/81443592664",
    "https://grokipedia.com/page/Jeff_Daniels_technology_executive",
  ],
};

// JSON-LD structured data — WebSite schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Dr. Jeff Daniels",
  description:
    "Official website of Dr. Jeff Daniels, Ph.D. — Technology Executive, Program Director at Lockheed Martin, and Professor of Cybersecurity.",
  author: {
    "@id": `${siteUrl}/#person`,
  },
  inLanguage: "en-US",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
