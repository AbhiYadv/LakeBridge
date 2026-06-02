import React from "react";
import { ArrowRight, Github } from "lucide-react";

function SQLWindow() {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl border border-white/10 bg-[#080808] overflow-hidden shadow-2xl">
      {/* Window title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-zinc-900/60">
        <div className="w-3 h-3 rounded-full bg-zinc-600" />
        <div className="w-3 h-3 rounded-full bg-zinc-600" />
        <div className="w-3 h-3 rounded-full bg-zinc-600" />
        <span className="ml-3 text-zinc-500 text-xs font-mono">analytics_query.sql</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-600">
          <span className="w-2 h-2 rounded-full bg-blue-500/80 inline-block" />
          <span>LakeBridge</span>
        </div>
      </div>

      {/* Code body */}
      <div className="p-6 font-mono text-sm leading-relaxed">
        <div className="text-zinc-500">-- Query Postgres + S3 lake from one endpoint</div>
        <div className="mt-3">
          <span className="text-sky-400">WITH</span>
          <span className="text-zinc-300"> active_users </span>
          <span className="text-sky-400">AS</span>
          <span className="text-zinc-300"> (</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">SELECT</span>
          <span className="text-zinc-300"> id, plan, created_at</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">FROM</span>
          <span className="text-zinc-300"> users</span>
          <span className="text-zinc-500">  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-- Postgres table</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">WHERE</span>
          <span className="text-zinc-300"> plan </span>
          <span className="text-sky-400">IN</span>
          <span className="text-zinc-300"> (</span>
          <span className="text-amber-300">'growth'</span>
          <span className="text-zinc-300">, </span>
          <span className="text-amber-300">'enterprise'</span>
          <span className="text-zinc-300">)</span>
        </div>
        <div className="text-zinc-300">)</div>
        <div className="mt-2">
          <span className="text-sky-400">SELECT</span>
        </div>
        <div className="pl-4">
          <span className="text-zinc-300">u.plan,</span>
        </div>
        <div className="pl-4">
          <span className="text-violet-400">COUNT</span>
          <span className="text-zinc-300">(</span>
          <span className="text-sky-400">DISTINCT</span>
          <span className="text-zinc-300"> e.user_id) </span>
          <span className="text-sky-400">AS</span>
          <span className="text-zinc-300"> active_users,</span>
        </div>
        <div className="pl-4">
          <span className="text-violet-400">SUM</span>
          <span className="text-zinc-300">(e.revenue_cents) / </span>
          <span className="text-emerald-400">100.0</span>
          <span className="text-zinc-300"> </span>
          <span className="text-sky-400">AS</span>
          <span className="text-zinc-300"> revenue_usd</span>
        </div>
        <div>
          <span className="text-sky-400">FROM</span>
          <span className="text-emerald-300"> lake.billing_events</span>
          <span className="text-zinc-300"> e</span>
          <span className="text-zinc-500">  &nbsp;&nbsp;-- S3 / Parquet</span>
        </div>
        <div>
          <span className="text-sky-400">JOIN</span>
          <span className="text-zinc-300"> active_users u </span>
          <span className="text-sky-400">ON</span>
          <span className="text-zinc-300"> e.user_id = u.id</span>
        </div>
        <div>
          <span className="text-sky-400">WHERE</span>
          <span className="text-zinc-300"> e.ts &gt;= </span>
          <span className="text-violet-400">now</span>
          <span className="text-zinc-300">() - </span>
          <span className="text-sky-400">INTERVAL</span>
          <span className="text-zinc-300"> </span>
          <span className="text-amber-300">'90 days'</span>
        </div>
        <div>
          <span className="text-sky-400">GROUP BY</span>
          <span className="text-zinc-300"> u.plan</span>
          <span className="text-sky-400"> ORDER BY</span>
          <span className="text-zinc-300"> revenue_usd </span>
          <span className="text-sky-400">DESC</span>
          <span className="text-zinc-300">;</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="px-4 py-2.5 border-t border-white/8 bg-zinc-900/40 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 font-mono">
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

export default function HeroSection() {
  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          Open source · Postgres-native · Now in private beta
        </div>

        {/* Main headline */}
        <h1
          data-testid="hero-title"
          className="font-heading font-black tracking-tight text-white mb-6"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05 }}
        >
          One Postgres endpoint.
          <br />
          <span className="text-zinc-400">Two worlds of data.</span>
        </h1>

        {/* Subtitle */}
        <p
          data-testid="hero-subtitle"
          className="max-w-2xl mx-auto text-lg text-zinc-400 mb-10 leading-relaxed"
        >
          LakeBridge lets your team query Postgres tables and S3/R2 lake data
          from a single SQL endpoint — without moving data, duplicating pipelines,
          or blocking production.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#waitlist"
            data-testid="hero-cta-primary"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors duration-150"
          >
            Get early access
            <ArrowRight size={16} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hero-cta-github"
            className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-md hover:bg-white/5 transition-colors duration-150"
          >
            <Github size={16} />
            View on GitHub
          </a>
        </div>

        {/* SQL Demo */}
        <div data-testid="hero-sql-block">
          <SQLWindow />
        </div>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
          {[
            { label: "Setup time", value: "< 5 min" },
            { label: "Postgres wire protocol", value: "100% compatible" },
            { label: "Data formats", value: "Parquet + Iceberg" },
            { label: "Query engine", value: "DuckDB / DataFusion" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-white font-semibold font-heading">{stat.value}</div>
              <div className="text-zinc-600 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
