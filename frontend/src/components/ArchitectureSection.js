import React from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

function FlowBox({ label, sublabel, highlight, color }) {
  return (
    <div
      className={`rounded-xl border px-5 py-4 text-center transition-all duration-200 ${
        highlight
          ? "border-blue-500/40 bg-blue-500/10"
          : "border-white/10 bg-zinc-900/40"
      }`}
    >
      <div className={`font-heading font-semibold text-sm ${highlight ? "text-blue-300" : "text-white"}`}>
        {label}
      </div>
      {sublabel && (
        <div className="text-zinc-500 text-xs mt-1">{sublabel}</div>
      )}
    </div>
  );
}

function Connector({ label, vertical = true }) {
  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row"} items-center gap-1`}>
      {vertical ? (
        <>
          <div className="w-px h-6 bg-white/15" />
          <ArrowDown size={12} className="text-zinc-600" />
          {label && (
            <span className="text-zinc-600 text-xs font-mono">{label}</span>
          )}
        </>
      ) : (
        <>
          <div className="h-px w-8 bg-white/15" />
          <ArrowRight size={12} className="text-zinc-600" />
        </>
      )}
    </div>
  );
}

const steps = [
  {
    num: "01",
    title: "Connect via standard Postgres",
    desc: "Your app, BI tool, psql, or dbt connects as it would to any Postgres database — no driver changes, no protocol changes.",
  },
  {
    num: "02",
    title: "LakeBridge extension intercepts lake queries",
    desc: "The open-source Postgres extension detects queries targeting external lake tables and routes them to the LakeBridge query gateway.",
  },
  {
    num: "03",
    title: "Gateway validates, estimates, routes",
    desc: "The gateway checks your policy rules, estimates bytes to scan, and decides: serve from cache, run in Postgres, or dispatch to an isolated worker.",
  },
  {
    num: "04",
    title: "Isolated worker scans lake data",
    desc: "A DuckDB/DataFusion-powered worker scans only the needed Parquet or Iceberg files from S3/R2/MinIO — without touching your Postgres production database.",
  },
];

export default function ArchitectureSection() {
  return (
    <section
      id="architecture"
      data-testid="architecture-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">
            How it works
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Simple by design.
            <br />
            <span className="text-zinc-500">Powerful under the hood.</span>
          </h2>
          <p className="mt-5 text-zinc-400 text-lg leading-relaxed">
            LakeBridge sits transparently between your SQL clients and your
            data. No new query language. No new endpoint to learn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Flow diagram */}
          <div data-testid="architecture-diagram" className="flex flex-col items-center gap-0">
            {/* Client layer */}
            <div className="w-full max-w-md">
              <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-4 text-center">
                <div className="text-zinc-400 text-xs mb-2 font-mono">Your clients</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {["App", "BI Tool", "psql", "dbt"].map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-md bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-mono"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="w-px h-6 bg-white/15" />
              <span className="text-zinc-600 text-xs font-mono my-1">Postgres wire protocol</span>
              <ArrowDown size={12} className="text-zinc-600" />
            </div>

            {/* Postgres + extension */}
            <div className="w-full max-w-md">
              <FlowBox
                label="Postgres + LakeBridge Extension"
                sublabel="open-source · self-hosted · pg extension"
                highlight={false}
              />
            </div>

            <Connector label="lake table detected" />

            {/* Gateway */}
            <div className="w-full max-w-md">
              <FlowBox
                label="Query Gateway"
                sublabel="validate policy · estimate cost · route"
                highlight={true}
              />
            </div>

            {/* Split routing */}
            <div className="w-full max-w-md mt-2">
              <div className="grid grid-cols-3 gap-3 items-start">
                {/* Cache */}
                <div className="flex flex-col items-center gap-1">
                  <ArrowDown size={12} className="text-zinc-600" />
                  <div className="w-full rounded-lg border border-white/10 bg-zinc-900/50 p-3 text-center">
                    <div className="text-emerald-400 text-xs font-mono font-medium">Cache</div>
                    <div className="text-zinc-600 text-xs mt-0.5">instant</div>
                  </div>
                </div>
                {/* Postgres engine */}
                <div className="flex flex-col items-center gap-1">
                  <ArrowDown size={12} className="text-zinc-600" />
                  <div className="w-full rounded-lg border border-white/10 bg-zinc-900/50 p-3 text-center">
                    <div className="text-blue-300 text-xs font-mono font-medium">Postgres</div>
                    <div className="text-zinc-600 text-xs mt-0.5">recent data</div>
                  </div>
                </div>
                {/* Isolated worker */}
                <div className="flex flex-col items-center gap-1">
                  <ArrowDown size={12} className="text-zinc-600" />
                  <div className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center">
                    <div className="text-blue-300 text-xs font-mono font-medium">Worker</div>
                    <div className="text-zinc-500 text-xs mt-0.5">lake scan</div>
                  </div>
                </div>
              </div>
            </div>

            {/* S3 layer */}
            <div className="w-full max-w-md mt-3 ml-auto" style={{ marginLeft: "auto" }}>
              <div className="ml-auto" style={{ width: "calc(33.33% - 4px)" }}>
                <div className="flex flex-col items-center gap-1">
                  <ArrowDown size={12} className="text-zinc-600" />
                  <div className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                    <div className="text-emerald-400 text-xs font-mono font-medium">S3 / R2 / MinIO</div>
                    <div className="text-zinc-600 text-xs mt-0.5">Parquet · Iceberg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-step explanation */}
          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                data-testid={`arch-step-${i}`}
                className="flex gap-5 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-zinc-500 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-200">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white text-base mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
