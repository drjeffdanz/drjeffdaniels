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

export const metadata: Metadata = {
  title: "Dr. Jeff Daniels | Digital Transformation Leader & Professor",
  description:
    "Dr. Jeff Daniels - Program Director at Lockheed Martin, Professor of Cybersecurity at UMGC, thought leader in AI, cloud computing, blockchain, and digital transformation.",
  keywords: [
    "Jeff Daniels",
    "Digital Transformation",
    "Cybersecurity",
    "Cloud Computing",
    "AI",
    "Blockchain",
    "Lockheed Martin",
    "UMGC",
    "Professor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
