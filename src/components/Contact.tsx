"use client";

import { useState, FormEvent } from "react";
import { Send, Linkedin, Mail, Twitter } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="py-24 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">Contact</span>
        </h2>
        <p className="text-light-text text-lg mb-16 max-w-2xl">
          Interested in collaborating, speaking engagements, or just want to
          connect? Reach out below.
        </p>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact form */}
          <div>
            {submitted ? (
              <div className="bg-dark-card border border-gold/30 rounded-xl p-8 text-center">
                <div className="text-gold text-4xl mb-4">&#10003;</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Message Sent
                </h3>
                <p className="text-light-text">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm text-light-text mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-light-text/50 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm text-light-text mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-light-text/50 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-light-text mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-light-text/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-light-text mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-light-text/50 focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-dark font-semibold px-8 py-3 rounded-full transition-colors duration-300"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Connect links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              Let&apos;s Connect
            </h3>
            <a
              href="https://www.linkedin.com/in/jeffdaniels/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-colors duration-300"
            >
              <Linkedin className="text-gold" size={24} />
              <div>
                <p className="text-white font-medium">LinkedIn</p>
                <p className="text-light-text text-sm">Connect professionally</p>
              </div>
            </a>
            <a
              href="https://x.com/jeffdaniels"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-colors duration-300"
            >
              <Twitter className="text-gold" size={24} />
              <div>
                <p className="text-white font-medium">X (Twitter)</p>
                <p className="text-light-text text-sm">@jeffdaniels</p>
              </div>
            </a>
            <a
              href="mailto:jeff.w.daniels@gmail.com"
              className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-colors duration-300"
            >
              <Mail className="text-gold" size={24} />
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-light-text text-sm">
                  jeff.w.daniels@gmail.com
                </p>
              </div>
            </a>

            <div className="bg-dark-card border border-dark-border rounded-xl p-6 mt-8">
              <h4 className="text-white font-medium mb-3">Areas of Interest</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Speaking Engagements",
                  "Academic Collaboration",
                  "Research Partnerships",
                  "Advisory Roles",
                  "Technology Consulting",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-dark border border-dark-border rounded-full px-3 py-1 text-xs text-gold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
