import React from "react";
import { ArrowDown } from "lucide-react";
import AnimatedSection, { AnimatedStagger, staggerItem } from "./AnimatedSection";
import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Connect via standard Postgres", desc: "Your app, BI tool, psql, or dbt connects as it would to any Postgres database. No driver changes, no protocol changes." },
  { num: "02", title: "LakeBridge extension intercepts lake queries", desc: "The open-source Postgres extension detects queries targeting external lake tables and routes them to the LakeBridge query gateway." },
  { num: "03", title: "Gateway validates, estimates, routes", desc: "The gateway checks your policy rules, estimates bytes to scan, and decides: serve from cache, run in Postgres, or dispatch to an isolated worker." },
  { num: "04", title: "Isolated worker scans lake data", desc: "A dedicated query worker scans only the needed Parquet or Iceberg files from S3/R2/MinIO, without touching your Postgres production database." },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" data-testid="architecture-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">How it works</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight leading-tight">
            Simple by design.
            <br /><span className="text-zinc-500">Powerful under the hood.</span>
          </h2>
          <p className="mt-5 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            LakeBridge sits transparently between your SQL clients and your data. No new query language. No new endpoint to learn.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection>
            <div data-testid="architecture-diagram" className="flex flex-col items-center gap-0">
              <div className="w-full max-w-md">
                <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/30 p-4 text-center">
                  <div className="text-zinc-500 text-xs mb-2 font-mono">Your clients</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["App", "BI Tool", "psql", "dbt"].map((c) => (
                      <span key={c} className="px-3 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-xs font-mono shadow-sm">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center py-2">
                <div className="w-px h-6 bg-zinc-300 dark:bg-white/15" />
                <span className="text-zinc-400 dark:text-zinc-600 text-xs font-mono my-1">Postgres wire protocol</span>
                <ArrowDown size={12} className="text-zinc-400 dark:text-zinc-600" />
              </div>
              <div className="w-full max-w-md">
                <div className="rounded-xl border border-zinc-200 dark:border-white/10 px-5 py-4 text-center bg-zinc-50 dark:bg-zinc-900/40">
                  <div className="font-heading font-semibold text-sm text-zinc-900 dark:text-white">Postgres + LakeBridge Extension</div>
                  <div className="text-zinc-500 text-xs mt-1">open-source · self-hosted · pg extension</div>
                </div>
              </div>
              <div className="flex flex-col items-center py-2">
                <div className="w-px h-4 bg-zinc-300 dark:bg-white/15" />
                <span className="text-zinc-400 dark:text-zinc-600 text-xs font-mono my-1">lake table detected</span>
                <ArrowDown size={12} className="text-zinc-400 dark:text-zinc-600" />
              </div>
              <div className="w-full max-w-md">
                <div className="rounded-xl border border-blue-400/40 dark:border-blue-500/40 px-5 py-4 text-center bg-blue-50 dark:bg-blue-500/10">
                  <div className="font-heading font-semibold text-sm text-blue-700 dark:text-blue-300">Query Gateway</div>
                  <div className="text-zinc-500 text-xs mt-1">validate policy · estimate cost · route</div>
                </div>
              </div>
              <div className="w-full max-w-md mt-2">
                <div className="grid grid-cols-3 gap-3 items-start">
                  {[
                    { label: "Cache", sub: "instant", color: "text-emerald-600 dark:text-emerald-400", border: "border-zinc-200 dark:border-white/10", bg: "bg-zinc-50 dark:bg-zinc-900/50" },
                    { label: "Postgres", sub: "recent data", color: "text-blue-600 dark:text-blue-300", border: "border-zinc-200 dark:border-white/10", bg: "bg-zinc-50 dark:bg-zinc-900/50" },
                    { label: "Worker", sub: "lake scan", color: "text-blue-700 dark:text-blue-300", border: "border-blue-400/30 dark:border-blue-500/30", bg: "bg-blue-50 dark:bg-blue-500/10" },
                  ].map((box) => (
                    <div key={box.label} className="flex flex-col items-center gap-1">
                      <ArrowDown size={12} className="text-zinc-400 dark:text-zinc-600" />
                      <div className={`w-full rounded-lg border ${box.border} ${box.bg} p-3 text-center`}>
                        <div className={`text-xs font-mono font-medium ${box.color}`}>{box.label}</div>
                        <div className="text-zinc-400 dark:text-zinc-600 text-xs mt-0.5">{box.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full max-w-md mt-3">
                <div className="grid grid-cols-3 gap-3">
                  <div /><div />
                  <div className="flex flex-col items-center gap-1">
                    <ArrowDown size={12} className="text-zinc-400 dark:text-zinc-600" />
                    <div className="w-full rounded-lg border border-emerald-400/20 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 p-2 text-center">
                      <div className="text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium whitespace-nowrap">S3 / R2 / MinIO</div>
                      <div className="text-zinc-400 dark:text-zinc-600 text-xs mt-0.5 whitespace-nowrap">Parquet · Iceberg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} variants={staggerItem} data-testid={`arch-step-${i}`} className="flex gap-5 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-xs font-mono text-zinc-500 group-hover:border-blue-400/30 dark:group-hover:border-blue-500/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-base mb-1.5">{step.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </div>
    </section>
  );
}
