import React from "react";

const companies = [
  "Stripe",
  "Vercel",
  "PlanetScale",
  "Neon",
  "Supabase",
  "Retool",
  "PostHog",
  "Linear",
];

export default function LogoBar() {
  return (
    <section
      data-testid="logo-bar"
      className="py-12 px-4 border-y border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-8 font-medium">
          Built for teams like those at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {companies.map((name) => (
            <span
              key={name}
              className="text-zinc-600 font-heading font-semibold text-base hover:text-zinc-400 transition-colors duration-200 cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
