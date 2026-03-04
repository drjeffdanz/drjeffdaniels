"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Publications", href: "/#publications" },
  { label: "Advisory Board", href: "/#advisory-board" },
  { label: "Awards", href: "/#awards" },
  { label: "Resume", href: "/#resume" },
  { label: "Attention Matrix", href: "/attention-matrix" },
  { label: "Tech Radar", href: "/tech-radar" },
  { label: "Contact", href: "/#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">
          <span className="text-white">DR. JEFF</span>{" "}
          <span className="text-gold">DANIELS</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-light-text hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark border-t border-dark-border">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-light-text hover:text-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
