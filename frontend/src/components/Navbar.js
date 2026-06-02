import React, { useState, useEffect } from "react";
import { Github, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#architecture" },
    { label: "Features", href: "#features" },
    { label: "Use Cases", href: "#usecases" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#" },
  ];

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            data-testid="navbar-logo"
            className="flex items-center gap-2 font-heading font-bold text-xl text-white"
          >
            <span className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-black">
              LB
            </span>
            <span>LakeBridge</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="navbar-github-link"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href="#waitlist"
              data-testid="navbar-cta-button"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-md hover:bg-zinc-200 transition-colors duration-150"
            >
              Get early access
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="navbar-mobile-menu-toggle"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 pb-6 pt-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-zinc-400 hover:text-white text-sm py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#waitlist"
              className="mt-2 px-4 py-2 text-sm font-medium bg-white text-black rounded-md text-center"
              onClick={() => setMenuOpen(false)}
            >
              Get early access
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
