import React from "react";
import { Github, Twitter } from "lucide-react";

const links = {
  Product: ["Features", "Architecture", "Use Cases", "Changelog"],
  Developers: ["Documentation", "GitHub", "Open Source Extension", "API Reference"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Security"],
};

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      className="border-t border-white/8 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 font-heading font-bold text-white mb-4">
              <span className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-black">
                LB
              </span>
              <span>LakeBridge</span>
            </a>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5">
              Postgres-native lakehouse access for data teams who move fast.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-github"
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <Github size={17} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-twitter"
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <Twitter size={17} />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
                {group}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors duration-150"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© 2025 LakeBridge, Inc. All rights reserved.</p>
          <p className="font-mono">
            Built for Postgres teams · Powered by open standards
          </p>
        </div>
      </div>
    </footer>
  );
}
