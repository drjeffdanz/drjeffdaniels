import type { Metadata } from "next";
import KeystaticApp from "./keystatic";
export const metadata: Metadata = { title: "Publishing", robots: { index: false, follow: false } };
export default function Layout() {
  if (process.env.NODE_ENV === "production" &&
    (!process.env.KEYSTATIC_GITHUB_CLIENT_ID || !process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || !process.env.KEYSTATIC_SECRET)) {
    return <main className="max-w-3xl mx-auto px-6 py-24"><h1 className="text-3xl text-gold font-bold mb-4">Publishing setup pending</h1><p className="text-light-text">The browser editor will be available after the site owner connects GitHub publishing.</p></main>;
  }
  return <KeystaticApp />;
}
