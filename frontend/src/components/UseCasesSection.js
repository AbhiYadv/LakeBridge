import React, { useState, useEffect, useMemo } from "react";
import { BarChart2, CreditCard, Activity, Archive } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

// ─── Token colour classes ──────────────────────────────────────────────────
const CLS = {
  cm: "text-zinc-400 dark:text-zinc-500",    // comment
  kw: "text-sky-600 dark:text-sky-400",      // keyword
  fn: "text-violet-600 dark:text-violet-400",// function
  st: "text-amber-600 dark:text-amber-300",  // string literal
  nu: "text-emerald-600 dark:text-emerald-400", // number
  lk: "text-emerald-600 dark:text-emerald-300", // lake table
};

// Sorted longest-first so multi-word keywords match before single words
const KEYWORDS = [
  "PERCENTILE_CONT","WITHIN GROUP","GROUP BY","ORDER BY","UNION ALL",
  "LEFT JOIN","SELECT","FROM","JOIN","WHERE","LIMIT","ON","AND","AS",
  "INTERVAL","BETWEEN","DISTINCT",
];
const FUNCTIONS = ["date_trunc","SUM","COUNT"];

// Build one big alternation, longest first
const TOKEN_RE = new RegExp(
  "('(?:[^'\\\\]|\\\\.)*')" +            // string literals
  "|([0-9]+(?:\\.[0-9]+)?)" +             // numbers
  "|(" + [...KEYWORDS, ...FUNCTIONS]
    .sort((a, b) => b.length - a.length)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|") + ")" +
  "|(lake\\.[a-z_]+)",                    // lake.table references
  "g"
);

function tokenizeSQL(sql) {
  const tokens = [];
  const lines = sql.split("\n");

  lines.forEach((line, li) => {
    if (li > 0) tokens.push({ text: "\n", cls: null });

    const commentIdx = line.indexOf("--");
    const code    = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
    const comment = commentIdx >= 0 ? line.slice(commentIdx)    : "";

    // tokenise code portion
    let last = 0;
    let m;
    const re = new RegExp(TOKEN_RE.source, "g");
    while ((m = re.exec(code)) !== null) {
      if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: null });
      const [full, str, num, kw, lk] = m;
      const cls = str ? "st" : num ? "nu" : lk ? "lk" :
                  FUNCTIONS.includes(kw) ? "fn" : "kw";
      tokens.push({ text: full, cls });
      last = m.index + full.length;
    }
    if (last < code.length) tokens.push({ text: code.slice(last), cls: null });

    if (comment) tokens.push({ text: comment, cls: "cm" });
  });

  return tokens;
}

// ─── Use-case data ─────────────────────────────────────────────────────────
const useCases = [
  {
    icon: <BarChart2 size={16} />, label: "Product Analytics",
    headline: "Cohort analysis without touching prod",
    description: "Join your Postgres user records with event logs stored in S3. Run 90-day retention, funnel, and feature usage queries, completely off your production database.",
    sql: `-- 90-day retention cohort
SELECT
  date_trunc('week', u.created_at) AS cohort,
  COUNT(DISTINCT u.id) AS users,
  COUNT(DISTINCT e.user_id) AS retained
FROM users u                          -- Postgres
LEFT JOIN lake.events e               -- S3/Parquet
  ON u.id = e.user_id
  AND e.ts BETWEEN u.created_at
             AND u.created_at + INTERVAL '90 days'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    icon: <CreditCard size={16} />, label: "Usage-Based Billing",
    headline: "Reconcile billing events at any scale",
    description: "Aggregate usage events from lake storage, join with Postgres subscription records, and generate invoices. No ETL pipelines or data warehouses required.",
    sql: `-- Monthly usage aggregation
SELECT
  s.customer_id,
  s.plan,
  SUM(e.api_calls) AS total_calls,
  SUM(e.compute_ms) / 1000.0 AS compute_sec
FROM subscriptions s                  -- Postgres
JOIN lake.usage_events e              -- S3/Parquet
  ON s.id = e.subscription_id
WHERE date_trunc('month', e.ts)
    = date_trunc('month', now())
GROUP BY 1, 2;`,
  },
  {
    icon: <Activity size={16} />, label: "Log & Trace Analysis",
    headline: "Query your observability data via SQL",
    description: "Store structured logs and traces in S3 as Parquet. Query them from your existing Postgres connection. No new tools, no new query language.",
    sql: `-- Find slow API endpoints this week
SELECT
  request_path,
  COUNT(*) AS req_count,
  PERCENTILE_CONT(0.95)
    WITHIN GROUP (ORDER BY duration_ms) AS p95_ms
FROM lake.api_logs                    -- S3/Parquet
WHERE ts >= now() - INTERVAL '7 days'
  AND status_code >= 500
GROUP BY 1
ORDER BY p95_ms DESC
LIMIT 20;`,
  },
  {
    icon: <Archive size={16} />, label: "Historical Reporting",
    headline: "Archive old data. Query it like it never left.",
    description: "Move historical rows from Postgres to S3/R2 to keep your database lean. Query the archive via LakeBridge as if the data is still in Postgres.",
    sql: `-- Revenue report: live + archived data
SELECT year, month,
  SUM(mrr_cents) / 100.0 AS mrr_usd
FROM (
  SELECT * FROM revenue             -- Postgres: last 6 months
  UNION ALL
  SELECT * FROM lake.revenue_archive -- S3: all history
) combined
GROUP BY 1, 2
ORDER BY 1, 2;`,
  },
];

// ─── Typewriter SQL panel ──────────────────────────────────────────────────
const SPEED = 13; // ms per character

function TypewriterPanel({ uc, tabKey }) {
  const tokens    = useMemo(() => tokenizeSQL(uc.sql), [uc.sql]);
  const totalChars = useMemo(() => tokens.reduce((s, t) => s + t.text.length, 0), [tokens]);

  const [charCount, setCharCount] = useState(0);

  // Reset + restart whenever the active tab changes
  useEffect(() => {
    setCharCount(0);
  }, [tabKey]);

  // Advance one char at a time
  useEffect(() => {
    if (charCount >= totalChars) return;
    const id = setTimeout(() => setCharCount((c) => c + 1), SPEED);
    return () => clearTimeout(id);
  }, [charCount, totalChars]);

  const done = charCount >= totalChars;

  // Render tokens up to charCount
  let remaining = charCount;
  const rendered = tokens.map((token, i) => {
    if (remaining <= 0) return null;
    const visible = token.text.slice(0, remaining);
    remaining = Math.max(0, remaining - token.text.length);
    return visible ? (
      <span key={i} className={CLS[token.cls] || "text-zinc-700 dark:text-zinc-300"}>
        {visible}
      </span>
    ) : null;
  });

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#070707] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-white/8 bg-zinc-100 dark:bg-zinc-900/50">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
        <span className="ml-3 text-zinc-400 dark:text-zinc-500 text-xs font-mono">
          {uc.label.toLowerCase().replace(/\s+/g, "_")}.sql
        </span>
      </div>

      {/* Typed SQL */}
      <pre
        data-testid="usecase-sql-typewriter"
        className="p-5 text-sm font-mono overflow-x-auto leading-relaxed whitespace-pre min-h-[220px]"
      >
        {rendered}
        {!done && (
          <span
            className="inline-block w-[2px] h-[1.1em] align-text-bottom bg-zinc-400 dark:bg-zinc-400 animate-pulse"
            aria-hidden="true"
          />
        )}
      </pre>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────
export default function UseCasesSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="usecases" data-testid="use-cases-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">Use cases</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight leading-tight">
            Real queries.
            <br /><span className="text-zinc-500">Real results.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Tab list */}
            <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {useCases.map((uc, i) => (
                <button key={i} onClick={() => setActive(i)} data-testid={`usecase-tab-${i}`}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left flex-shrink-0 lg:flex-shrink transition-all duration-150 ${
                    active === i
                      ? "border-blue-400/40 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-zinc-900 dark:text-white"
                      : "border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-white/15"
                  }`}>
                  <span className={active === i ? "text-blue-500 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"}>
                    {uc.icon}
                  </span>
                  <span className="font-medium text-sm whitespace-nowrap">{uc.label}</span>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className="lg:col-span-3">
              <div className="mb-5">
                <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-2xl mb-3">
                  {useCases[active].headline}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {useCases[active].description}
                </p>
              </div>
              <TypewriterPanel uc={useCases[active]} tabKey={active} />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
