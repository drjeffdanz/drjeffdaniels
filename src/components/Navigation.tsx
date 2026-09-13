"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const groups = [
  { label: "About", links: [
    { label: "Biography", href: "/#about" },
    { label: "Expertise", href: "/#expertise" },
    { label: "Publications", href: "/#publications" },
    { label: "Advisory Board", href: "/#advisory-board" },
    { label: "Awards", href: "/#awards" },
    { label: "Resume", href: "/#resume" },
  ] },
  { label: "Games", links: [
    { label: "Zork", href: "/zork" },
    { label: "Sisters’ Quest", href: "/sisters-quest" },
    { label: "Jeffasketch", href: "/jeffasketch" },
  ] },
  { label: "Strategic Planning Tools", links: [
    { label: "Attention Matrix", href: "/attention-matrix" },
    { label: "Tech Radar", href: "/tech-radar" },
    { label: "Defense AI Brief", href: "/defense-ai-brief" },
  ] },
  { label: "Resource Library", links: [
    { label: "All Resources", href: "/free-tools" },
    { label: "Mission Model", href: "/free-tools/mission-model" },
    { label: "Career Vision", href: "/free-tools/career-vision" },
    { label: "Transformation Objectives", href: "/free-tools/transformation-objectives" },
    { label: "Career Planning Guide", href: "/free-tools/career-planning-guide" },
  ] },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  function close() { setIsOpen(false); setActiveGroup(null); }

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (!nav.current?.contains(event.target as Node)) {
        setActiveGroup(null); setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <nav ref={nav} aria-label="Main navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (activeGroup) {
            nav.current?.querySelector<HTMLButtonElement>(`[data-group="${activeGroup}"]`)?.focus();
            setActiveGroup(null);
          } else {
            nav.current?.querySelector<HTMLButtonElement>("[aria-controls='site-navigation']")?.focus();
            setIsOpen(false);
          }
        }
      }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6 min-h-[73px] flex flex-wrap items-center justify-between gap-x-6">
        <Link href="/" onClick={close} className="text-xl font-bold tracking-tight shrink-0">
          <span className="text-white">DR. JEFF</span>{" "}<span className="text-gold">DANIELS</span>
        </Link>
        <button type="button" className="lg:hidden text-white p-2" aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen} aria-controls="site-navigation" onClick={() => { setIsOpen(!isOpen); setActiveGroup(null); }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div id="site-navigation" className={`${isOpen ? "flex" : "hidden"} lg:flex w-full lg:w-auto flex-col lg:flex-row lg:items-center gap-1 lg:gap-5 py-3 lg:py-0 max-h-[calc(100dvh-73px)] overflow-y-auto lg:overflow-visible`}>
          {groups.map((group, index) => (
            <div key={group.label} className="contents">
              {index === 1 && <Link href="/thought-leadership" onClick={close} className="py-3 text-sm text-light-text hover:text-gold">Thought Leadership</Link>}
              <div className="relative">
                <button type="button" data-group={group.label} aria-expanded={activeGroup === group.label}
                  aria-controls={`nav-group-${index}`} onClick={() => setActiveGroup(activeGroup === group.label ? null : group.label)}
                  className="flex w-full items-center justify-between gap-1 py-3 text-sm text-light-text hover:text-gold">
                  {group.label}<ChevronDown size={14} className={activeGroup === group.label ? "rotate-180" : ""} />
                </button>
                <div id={`nav-group-${index}`} hidden={activeGroup !== group.label}
                  className="lg:absolute lg:right-0 lg:top-full lg:w-64 rounded-xl border border-dark-border bg-dark-card p-2 shadow-xl">
                  {group.links.map((link) => <Link key={link.href} href={link.href} onClick={close}
                    className="block rounded-lg px-3 py-2.5 text-sm text-light-text hover:text-gold hover:bg-dark focus-visible:bg-dark">{link.label}</Link>)}
                </div>
              </div>
            </div>
          ))}
          <Link href="/#contact" onClick={close} className="py-3 text-sm text-light-text hover:text-gold">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
