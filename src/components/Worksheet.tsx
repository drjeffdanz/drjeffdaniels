"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import type { freeTools } from "@/lib/free-tools";

export default function Worksheet({ tool }: { tool: (typeof freeTools)[number] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [downloaded, setDownloaded] = useState(false);
  function download() {
    const content = `${tool.title}\nDr. Jeff Daniels\n\n${tool.fields.map(field => `${field.label}\n${field.prompt}\n\n${answers[field.label] || "(Not completed)"}`).join("\n\n--------------------\n\n")}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${tool.slug}.txt`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return <div>
    <p className="text-sm text-light-text mb-8">Your answers stay in this page and are not sent to a server. Download them before leaving or refreshing.</p>
    <div className="space-y-6">{tool.fields.map((field, i) => <div key={field.label} className="bg-dark-card border border-dark-border rounded-xl p-6">
      <label htmlFor={`answer-${i}`} className="block text-white text-lg font-semibold mb-2">{field.label}</label>
      <p id={`prompt-${i}`} className="text-light-text text-sm leading-relaxed mb-4">{field.prompt}</p>
      <textarea id={`answer-${i}`} aria-describedby={`prompt-${i}`} rows={4} value={answers[field.label] || ""}
        onChange={event => { setAnswers({ ...answers, [field.label]: event.target.value }); setDownloaded(false); }}
        className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold resize-y" />
    </div>)}</div>
    <button type="button" onClick={download} className="inline-flex items-center gap-2 mt-8 bg-gold hover:bg-gold-light text-dark font-semibold px-6 py-3 rounded-full transition-colors duration-300"><Download size={18} />Download worksheet</button>
    <p role="status" className="text-sm text-light-text mt-3">{downloaded ? "Your worksheet download is ready. Keep the file with your planning notes." : "Downloads as a text file you can open and edit."}</p>
  </div>;
}
