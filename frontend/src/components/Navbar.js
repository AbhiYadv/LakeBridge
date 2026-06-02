import React, { useState, useEffect } from "react";
import { Github, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      data-testid="theme-toggle"
      className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Product", href: "#architecture" },
    { label: "Features", href: "#features" },
    { label: "Use Cases", href: "#usecases" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" data-testid="navbar-logo"
            className="flex items-center gap-2 font-heading font-bold text-xl text-zinc-900 dark:text-white">
            <span className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-black">LB</span>
            <span>LakeBridge</span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              data-testid="navbar-github-link"
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Github size={18} />
            </a>
            <a href="#waitlist" data-testid="navbar-cta-button"
              className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-black rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors duration-150">
              Get early access
            </a>
          </div>

          <button className="md:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)} data-testid="navbar-mobile-menu-toggle">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 border-b border-zinc-200 dark:border-white/10 px-6 pb-6 pt-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm py-1"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <a href="#waitlist"
                className="flex-1 px-4 py-2 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-black rounded-md text-center"
                onClick={() => setMenuOpen(false)}>
                Get early access
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
