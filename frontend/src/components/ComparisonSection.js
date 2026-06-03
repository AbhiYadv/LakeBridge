import React from "react";
import { Check, X, Minus } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  "Single Postgres endpoint","No data migration needed","Protects production DB",
  "Open-source component","Parquet & Iceberg support","Query cost controls",
  "Setup in minutes","Postgres-native auth",
];
const tools = [
  { name: "LakeBridge", highlight: true },
  { name: "pg_duckdb / pg_lake" }, { name: "Snowflake" }, { name: "AWS Athena" },
  { name: "Databricks" }, { name: "Trino" },
];
// rows: Single PG endpoint, No data migration, Protects prod DB, Open-source component,
//       Parquet & Iceberg, Query cost controls, Setup in minutes, Postgres-native auth
const matrix = [
  [true,true,false,false,false,false],
  [true,true,false,true,false,true],
  [true,false,true,true,true,true],
  [true,true,false,false,false,true],
  [true,true,true,true,true,true],
  [true,false,true,true,true,false],
  [true,true,false,false,false,false],
  [true,true,false,false,false,false],
];

function Cell({ val, highlight }) {
  if (val === true) return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${highlight ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
      <Check size={13} className={highlight ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"} />
    </span>
  );
  if (val === false) return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900">
      <X size={13} className="text-zinc-400 dark:text-zinc-700" />
    </span>
  );
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900">
      <Minus size={13} className="text-zinc-400 dark:text-zinc-600" />
    </span>
  );
}

export default function ComparisonSection() {
  return (
    <section id="comparison" data-testid="comparison-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">Market positioning</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight leading-tight">
            Not pg_duckdb. Not Snowflake.
            <br /><span className="text-zinc-500">The governed gateway.</span>
          </h2>
          <p className="mt-5 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            pg_duckdb and pg_lake let you query Parquet from Postgres — free, open source, backed by Snowflake and MotherDuck. LakeBridge is what you add when a whole team needs to do it safely: isolated workers so no query touches your primary, cost estimates before every scan, per-user byte limits, and a full audit trail. Same SQL. Governed.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div data-testid="comparison-table" className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/10">
                  <th className="text-left px-5 py-4 text-zinc-500 font-medium text-sm w-48">Feature</th>
                  {tools.map((tool) => (
                    <th key={tool.name}
                      className={`px-4 py-4 text-sm font-heading font-semibold text-center ${tool.highlight ? "text-zinc-900 dark:text-white bg-blue-50 dark:bg-blue-500/8" : "text-zinc-500"}`}>
                      {tool.highlight && <span className="block text-xs text-blue-600 dark:text-blue-400 font-mono font-normal mb-0.5">← this</span>}
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feat, fi) => (
                  <tr key={fi} className="border-b border-zinc-100 dark:border-white/5 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-zinc-700 dark:text-zinc-300 font-medium">{feat}</td>
                    {tools.map((tool, ti) => (
                      <td key={ti} className={`px-4 py-3.5 text-center ${tool.highlight ? "bg-blue-50/50 dark:bg-blue-500/5" : ""}`}>
                        <Cell val={matrix[fi][ti]} highlight={tool.highlight} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600 text-right">
            Partial support marked with ~. Comparison is approximate; actual capabilities vary by configuration.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
