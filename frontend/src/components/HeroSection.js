import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Github, Star } from "lucide-react";
import { motion } from "framer-motion";

// ─── GitHub star badge ────────────────────────────────────────────────────────

const GITHUB_REPO = "lakebridge/lakebridge";
const GITHUB_URL  = `https://github.com/${GITHUB_REPO}`;
const CACHE_KEY   = `gh_stars_${GITHUB_REPO}`;
const CACHE_TTL   = 5 * 60 * 1000;

function formatStars(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

function useGitHubStars() {
  const [stars, setStars] = useState(null);
  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.ts < CACHE_TTL) { setStars(cached.stars); return; }
    } catch {}
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const s = data.stargazers_count ?? null;
        setStars(s);
        if (s !== null) sessionStorage.setItem(CACHE_KEY, JSON.stringify({ stars: s, ts: Date.now() }));
      })
      .catch(() => {});
  }, []);
  return stars;
}

// ─── Typewriter SQL ───────────────────────────────────────────────────────────

// Each token: { text, cls }  — cls maps to a Tailwind color pair
const T = (text, cls) => ({ text, cls });

const SQL_TOKENS = [
  T("-- Query Postgres + S3 lake from one endpoint\n", "cm"),
  T("WITH",    "kw"), T(" active_users ", "id"), T("AS", "kw"), T(" (\n",            "id"),
  T("  "),             T("SELECT", "kw"),           T(" id, plan, created_at\n",       "id"),
  T("  "),             T("FROM",   "kw"),           T(" users               ",         "id"),
  T("-- Postgres table\n", "cm"),
  T("  "),             T("WHERE",  "kw"),           T(" plan ",              "id"),
  T("IN", "kw"),       T(" (",                      "id"),
  T("'growth'",        "st"),                        T(", ",                 "id"),
  T("'enterprise'",    "st"),                        T(")\n",                "id"),
  T(")\n",             "id"),
  T("SELECT\n",        "kw"),
  T("  "),             T("u.plan,\n",               "id"),
  T("  "),             T("COUNT",  "fn"),            T("(",                  "id"),
  T("DISTINCT",        "kw"),                        T(" e.user_id) ",       "id"),
  T("AS",              "kw"),                        T(" active_users,\n",   "id"),
  T("  "),             T("SUM",    "fn"),            T("(e.revenue_cents) / ","id"),
  T("100.0",           "nu"),                        T(" ",                  "id"),
  T("AS",              "kw"),                        T(" revenue_usd\n",     "id"),
  T("FROM",            "kw"),                        T(" lake.billing_events","lk"),
  T(" e  ",            "id"),                        T("-- S3 / Parquet\n",  "cm"),
  T("JOIN",            "kw"),                        T(" active_users u ",   "id"),
  T("ON",              "kw"),                        T(" e.user_id = u.id\n","id"),
  T("WHERE",           "kw"),                        T(" e.ts >= ",          "id"),
  T("now",             "fn"),                        T("() - ",              "id"),
  T("INTERVAL",        "kw"),                        T(" ",                  "id"),
  T("'90 days'",       "st"),                        T("\n",                 "id"),
  T("GROUP BY",        "kw"),                        T(" u.plan ",           "id"),
  T("ORDER BY",        "kw"),                        T(" revenue_usd ",      "id"),
  T("DESC",            "kw"),                        T(";",                  "id"),
];

const CLS = {
  cm: "text-zinc-400 dark:text-zinc-500",
  kw: "text-sky-600 dark:text-sky-400",
  id: "text-zinc-700 dark:text-zinc-300",
  st: "text-amber-600 dark:text-amber-300",
  fn: "text-violet-600 dark:text-violet-400",
  nu: "text-emerald-600 dark:text-emerald-400",
  lk: "text-emerald-600 dark:text-emerald-300",
};

const SPEED      = 14;   // ms per character
const HOLD_MS    = 2400; // pause before restarting
const RESTART_MS = 400;  // blank pause between loops

function TypewriterSQL() {
  const totalChars = useMemo(() => SQL_TOKENS.reduce((s, t) => s + t.text.length, 0), []);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState("typing"); // "typing" | "holding" | "clearing"

  useEffect(() => {
    let id;
    if (phase === "typing") {
      if (charCount >= totalChars) {
        setPhase("holding");
        return;
      }
      id = setTimeout(() => setCharCount((c) => c + 1), SPEED);
    } else if (phase === "holding") {
      id = setTimeout(() => setPhase("clearing"), HOLD_MS);
    } else if (phase === "clearing") {
      id = setTimeout(() => { setCharCount(0); setPhase("typing"); }, RESTART_MS);
    }
    return () => clearTimeout(id);
  }, [phase, charCount, totalChars]);

  // Render visible portion of tokens
  let remaining = charCount;
  const rendered = SQL_TOKENS.map((token, i) => {
    if (remaining <= 0) return null;
    const visible = token.text.slice(0, remaining);
    remaining = Math.max(0, remaining - token.text.length);
    return visible ? (
      <span key={i} className={CLS[token.cls] || ""}>{visible}</span>
    ) : null;
  });

  const cursorOn = phase === "typing" || phase === "holding";

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#080808] overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-white/8 bg-zinc-100 dark:bg-zinc-900/60">
        <div className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        <div className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        <div className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        <span className="ml-3 text-zinc-500 text-xs font-mono">analytics_query.sql</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-600">
          <span className="w-2 h-2 rounded-full bg-blue-500/80 inline-block" />
          <span>LakeBridge</span>
        </div>
      </div>

      {/* Typed SQL body */}
      <pre
        data-testid="hero-sql-typewriter"
        className="p-6 text-sm font-mono leading-relaxed whitespace-pre overflow-x-auto min-h-[260px]"
      >
        {rendered}
        {cursorOn && (
          <span
            className="inline-block w-[2px] h-[1.1em] align-text-bottom bg-zinc-400 dark:bg-zinc-400 animate-pulse"
            aria-hidden="true"
          />
        )}
      </pre>

      {/* Status bar */}
      <div className="px-4 py-2.5 border-t border-zinc-200 dark:border-white/8 bg-zinc-100 dark:bg-zinc-900/40 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Routed to isolated worker
        </span>
        <span className="hidden sm:inline">|</span>
        <span>cache miss · executed in 1.4s</span>
        <span className="hidden sm:inline">|</span>
        <span>0 rows read from Postgres prod</span>
        <span className="hidden sm:inline">|</span>
        <span>12.3 MB scanned from lake</span>
      </div>
    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

export default function HeroSection() {
  const stars = useGitHubStars();

  return (
    <section id="hero" data-testid="hero-section"
      className="relative hero-grid pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-7xl mx-auto text-center">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-xs text-zinc-600 dark:text-zinc-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Open source · Postgres-native · Now in private beta
          </div>
        </motion.div>

        <motion.h1 data-testid="hero-title"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-black tracking-tight text-zinc-900 dark:text-white mb-6"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05 }}>
          One Postgres endpoint.
          <br />
          <span className="text-zinc-500">Two worlds of data.</span>
        </motion.h1>

        <motion.p data-testid="hero-subtitle"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
          LakeBridge lets your team query Postgres tables and S3/R2 lake data
          from a single SQL endpoint, without moving data, duplicating pipelines,
          or blocking production.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="#waitlist" data-testid="hero-cta-primary"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors duration-150">
            Get early access <ArrowRight size={16} />
          </a>

          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
            data-testid="hero-cta-github"
            className="group flex items-center gap-0 rounded-md border border-zinc-300 dark:border-white/20 overflow-hidden text-sm font-medium transition-colors duration-150 hover:border-zinc-400 dark:hover:border-white/30">
            <span className="flex items-center gap-2 px-4 py-3 text-zinc-700 dark:text-white bg-transparent group-hover:bg-zinc-100 dark:group-hover:bg-white/5 transition-colors duration-150">
              <Github size={16} />
              View on GitHub
            </span>
            {stars !== null && (
              <span data-testid="github-star-count"
                className="flex items-center gap-1.5 px-3 py-3 border-l border-zinc-300 dark:border-white/20 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-white/5 group-hover:bg-zinc-100 dark:group-hover:bg-white/8 transition-colors duration-150 tabular-nums">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                {formatStars(stars)}
              </span>
            )}
          </a>
        </motion.div>

        <motion.div data-testid="hero-sql-block"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <TypewriterSQL />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
          {[
            { label: "Setup time",            value: "< 5 min"           },
            { label: "Postgres wire protocol", value: "100% compatible"   },
            { label: "Data formats",           value: "Parquet + Iceberg" },
            { label: "Query engine",           value: "DuckDB / DataFusion"},
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-zinc-900 dark:text-white font-semibold font-heading">{stat.value}</div>
              <div className="text-zinc-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
