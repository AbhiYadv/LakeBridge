import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setMessage("You're on the list! We'll reach out when your spot is ready.");
    }, 600);
  };

  return (
    <section id="waitlist" data-testid="waitlist-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/30 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-xs text-blue-600 dark:text-blue-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse" />
              Now accepting private beta applications
            </div>

            <h2 className="font-heading font-black text-zinc-900 dark:text-white tracking-tight mb-5"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1 }}>
              Ship faster. Keep Postgres.
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Join the waitlist to get early access to the LakeBridge managed cloud.
              We're onboarding Postgres-first teams who want warehouse-like access without the warehouse.
            </p>

            {status === "success" || status === "existing" ? (
              <div data-testid="waitlist-success-message"
                className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-medium ${
                  status === "success"
                    ? "border-emerald-400/30 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-blue-400/30 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-testid="waitlist-form"
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" required data-testid="waitlist-email-input"
                  className="flex-1 px-4 py-3 rounded-md bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors" />
                <button type="submit" disabled={status === "loading"} data-testid="waitlist-submit-button"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap">
                  {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <><span>Get early access</span><ArrowRight size={15} /></>}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-sm text-red-500 dark:text-red-400" data-testid="waitlist-error-message">{message}</p>
            )}
            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">No spam. Just a heads-up when your spot is ready.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-14 pt-10 border-t border-zinc-100 dark:border-white/5">
            <p className="text-sm text-zinc-500 mb-6">What engineers are saying</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {[
                { quote: "Finally, a way to query our S3 archive from the same Postgres connection our backend uses.", name: "Alex M.", role: "Staff Engineer" },
                { quote: "We were about to spin up Trino. LakeBridge is 10x simpler for what we actually need.", name: "Priya K.", role: "Data Engineer" },
                { quote: "The isolated worker model is the right abstraction. Our prod DB stopped getting hammered.", name: "Dan R.", role: "CTO, SaaS startup" },
              ].map((t, i) => (
                <div key={i} className="p-5 rounded-xl border border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-zinc-900/30">
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                  <div>
                    <p className="text-zinc-900 dark:text-white text-sm font-medium">{t.name}</p>
                    <p className="text-zinc-500 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
