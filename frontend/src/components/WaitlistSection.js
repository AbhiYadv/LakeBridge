import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | existing
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await axios.post(`${API}/waitlist`, { email: email.trim() });
      setStatus(res.data.status === "existing" ? "existing" : "success");
      setMessage(res.data.message);
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="waitlist"
      data-testid="waitlist-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block animate-pulse" />
            Now accepting private beta applications
          </div>

          <h2 className="font-heading font-black text-white tracking-tight mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1 }}>
            Ship faster. Keep Postgres.
          </h2>

          <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join the waitlist to get early access to the LakeBridge managed cloud.
            We're onboarding Postgres-first teams who want warehouse-like access
            without the warehouse.
          </p>

          {/* Form */}
          {status === "success" || status === "existing" ? (
            <div
              data-testid="waitlist-success-message"
              className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-medium ${
                status === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              {message}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              data-testid="waitlist-form"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                data-testid="waitlist-email-input"
                className="flex-1 px-4 py-3 rounded-md bg-zinc-900 border border-white/15 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                data-testid="waitlist-submit-button"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Get early access
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-400" data-testid="waitlist-error-message">
              {message}
            </p>
          )}

          <p className="mt-4 text-xs text-zinc-600">
            No spam. No marketing. Just a heads-up when you're off the waitlist.
          </p>

          {/* Social proof */}
          <div className="mt-14 pt-10 border-t border-white/5">
            <p className="text-sm text-zinc-500 mb-6">What engineers are saying</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {[
                {
                  quote:
                    "Finally — a way to query our S3 archive from the same Postgres connection our backend uses.",
                  name: "Alex M.",
                  role: "Staff Engineer",
                },
                {
                  quote:
                    "We were about to spin up Trino. LakeBridge is 10x simpler for what we actually need.",
                  name: "Priya K.",
                  role: "Data Engineer",
                },
                {
                  quote:
                    "The isolated worker model is the right abstraction. Our prod DB stopped getting hammered.",
                  name: "Dan R.",
                  role: "CTO, SaaS startup",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-white/8 bg-zinc-900/30"
                >
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-zinc-500 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
