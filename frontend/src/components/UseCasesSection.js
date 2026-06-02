import React, { useState } from "react";
import { BarChart2, CreditCard, Activity, Archive } from "lucide-react";

const useCases = [
  {
    icon: <BarChart2 size={16} />,
    label: "Product Analytics",
    headline: "Cohort analysis without touching prod",
    description:
      "Join your Postgres user records with event logs stored in S3. Run 90-day retention, funnel, and feature usage queries — completely off your production database.",
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
    icon: <CreditCard size={16} />,
    label: "Usage-Based Billing",
    headline: "Reconcile billing events at any scale",
    description:
      "Aggregate usage events from lake storage, join with Postgres subscription records, and generate invoices — without ETL pipelines or data warehouses.",
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
    icon: <Activity size={16} />,
    label: "Log & Trace Analysis",
    headline: "Query your observability data via SQL",
    description:
      "Store structured logs and traces in S3 as Parquet. Query them from your existing Postgres connection — no new tools, no new query language.",
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
    icon: <Archive size={16} />,
    label: "Historical Reporting",
    headline: "Archive old data. Query it like it never left.",
    description:
      "Move historical rows from Postgres to S3/R2 to keep your database lean. Query the archive via LakeBridge as if the data is still in Postgres.",
    sql: `-- Revenue report: live + archived data
SELECT
  year,
  month,
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

export default function UseCasesSection() {
  const [active, setActive] = useState(0);
  const uc = useCases[active];

  return (
    <section
      id="usecases"
      data-testid="use-cases-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">
            Use cases
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Real queries.
            <br />
            <span className="text-zinc-500">Real results.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Tab sidebar */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {useCases.map((uc, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                data-testid={`usecase-tab-${i}`}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left flex-shrink-0 lg:flex-shrink transition-all duration-150 ${
                  active === i
                    ? "border-blue-500/40 bg-blue-500/10 text-white"
                    : "border-white/8 bg-zinc-900/30 text-zinc-400 hover:text-white hover:bg-zinc-900/60 hover:border-white/15"
                }`}
              >
                <span
                  className={`${active === i ? "text-blue-400" : "text-zinc-500"}`}
                >
                  {uc.icon}
                </span>
                <span className="font-medium text-sm whitespace-nowrap">{uc.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div key={active} className="lg:col-span-3">
            <div className="mb-5">
              <h3 className="font-heading font-semibold text-white text-2xl mb-3">
                {uc.headline}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{uc.description}</p>
            </div>

            {/* SQL code */}
            <div className="rounded-xl border border-white/10 bg-[#070707] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-zinc-900/50">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 text-zinc-500 text-xs font-mono">{uc.label.toLowerCase().replace(/\s+/g, "_")}.sql</span>
              </div>
              <pre className="p-5 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">
                {uc.sql
                  .split("\n")
                  .map((line, li) => (
                    <div key={li}>
                      {line
                        .split(/(SELECT|FROM|JOIN|LEFT|WHERE|GROUP BY|ORDER BY|UNION ALL|LIMIT|ON|AND|AS|INTERVAL|BETWEEN|WITHIN GROUP|PERCENTILE_CONT|date_trunc|SUM|COUNT|DISTINCT)/g)
                        .map((part, pi) => {
                          const keywords = ["SELECT","FROM","JOIN","LEFT","WHERE","GROUP BY","ORDER BY","UNION ALL","LIMIT","ON","AND","AS","INTERVAL","BETWEEN","WITHIN GROUP"];
                          const funcs = ["PERCENTILE_CONT","date_trunc","SUM","COUNT","DISTINCT"];
                          if (keywords.includes(part)) {
                            return <span key={pi} className="text-sky-400">{part}</span>;
                          } else if (funcs.includes(part)) {
                            return <span key={pi} className="text-violet-400">{part}</span>;
                          }
                          return <span key={pi}>{part}</span>;
                        })}
                    </div>
                  ))}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
