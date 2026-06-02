import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Copy, Check as CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, useInView } from "framer-motion";

// ─── Animated helpers ────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease }}>
      {children}
    </motion.div>
  );
}

function StaggerList({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  return (
    <motion.div ref={ref} className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: 0.09 } } }}>
      {children}
    </motion.div>
  );
}

const slideItem = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Layer data ──────────────────────────────────────────────────────────────
const LAYERS = [
  {
    layer: "Layer 1", name: "Client Layer",
    accent: "border-l-zinc-400 dark:border-l-zinc-500",
    badge: "text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800",
    nameColor: "text-zinc-900 dark:text-white",
    sub: "App · BI Tool · psql · dbt",
    desc: "Your application code, BI tools (Metabase, Superset, Redash), psql CLI, dbt models, and any Postgres-compatible library. Zero changes required. LakeBridge speaks standard Postgres wire protocol.",
  },
  {
    layer: "Layer 2", name: "Extension Layer",
    accent: "border-l-blue-500",
    badge: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60",
    nameColor: "text-blue-700 dark:text-blue-300",
    sub: "Postgres + LakeBridge Extension (open source)",
    desc: "The open-source Postgres extension installs directly into your database. It intercepts SQL statements referencing registered lake schemas and forwards them to the Query Gateway. Postgres-only queries pass through without any overhead.",
  },
  {
    layer: "Layer 3", name: "Query Gateway",
    accent: "border-l-violet-500",
    badge: "text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/60",
    nameColor: "text-violet-700 dark:text-violet-300",
    sub: "Policy validation · Cost estimation · Routing · Audit logging",
    desc: "The gateway is the decision engine. For every lake-touching query it validates policy rules, estimates scan cost, checks the cache, determines the execution path, and records an audit log entry. It returns the final result set to the Postgres client.",
  },
  {
    layer: "Layer 4", name: "Execution Layer",
    accent: "border-l-emerald-500",
    badge: "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60",
    nameColor: "text-emerald-700 dark:text-emerald-300",
    sub: "Cache path · Native Postgres path · Isolated worker path",
    desc: "Queries are dispatched to one of three execution paths based on the gateway's routing decision. All paths are completely invisible to the SQL client. The response format is identical regardless of which path was used.",
  },
  {
    layer: "Layer 5", name: "Storage Layer",
    accent: "border-l-amber-500",
    badge: "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60",
    nameColor: "text-amber-700 dark:text-amber-300",
    sub: "Postgres · S3 / R2 / MinIO (Parquet, Iceberg)",
    desc: "Your Postgres database and object storage. Data never moves or gets copied. Isolated workers scan object storage files directly in-place using columnar projection and partition pruning to minimize I/O.",
  },
];

// ─── LayersBlock component ───────────────────────────────────────────────────
function LayersBlock() {
  return (
    <FadeUp className="mb-10">
      <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-5">System layers</h3>
      <StaggerList className="space-y-3">
        {LAYERS.map((l) => (
          <motion.div key={l.layer} variants={fadeItem}
            className={`flex gap-4 p-5 rounded-xl border-l-4 border border-zinc-200 dark:border-white/10 ${l.accent} bg-white dark:bg-[#141414] hover:-translate-y-0.5 transition-transform duration-200`}>
            <div className="flex-shrink-0 w-14 pt-0.5">
              <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono font-medium ${l.badge}`}>
                {l.layer.split(" ")[1]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-heading font-semibold text-sm mb-0.5 ${l.nameColor}`}>{l.name}</div>
              <div className="text-zinc-400 dark:text-zinc-500 text-xs font-mono mb-2 leading-snug">{l.sub}</div>
              <p className="text-zinc-700 dark:text-zinc-200 text-sm leading-relaxed">{l.desc}</p>
            </div>
          </motion.div>
        ))}
      </StaggerList>
    </FadeUp>
  );
}

// ─── LifecycleBlock component ────────────────────────────────────────────────
const LIFECYCLE_STEPS = [
  { step: 1, title: "SQL sent via Postgres wire protocol", detail: "Your client sends a SQL statement over the standard Postgres wire protocol. The connection string, driver, and authentication are unchanged from your existing Postgres setup." },
  { step: 2, title: "Extension inspects the query", detail: "The LakeBridge extension intercepts the query. If it references only native Postgres tables, it is passed directly to the Postgres executor with zero overhead." },
  { step: 3, title: "Gateway receives lake query", detail: "If the query references one or more registered lake schemas (e.g. lake.*), the extension forwards it to the LakeBridge Query Gateway for routing." },
  { step: 4, title: "Policy validation", detail: "The gateway checks the caller's role against configured policy rules: allowed tables, max bytes scanned, concurrency limits, and allowed time windows." },
  { step: 5, title: "Cache lookup", detail: "The gateway checks the result cache. If an exact match is found for this query, the cached result is returned immediately. No scan occurs." },
  { step: 6, title: "Cost estimation and routing", detail: "If no cache hit, the gateway estimates scan cost using partition metadata and statistics. It routes to the optimal execution path: native Postgres for hybrid queries, or an isolated worker for lake-heavy scans." },
  { step: 7, title: "Execution and result merge", detail: "The worker scans only the required file partitions using columnar projection. For cross-source JOINs, the gateway merges results from the Postgres executor and the worker before returning." },
  { step: 8, title: "Cache write and audit log", detail: "The result is optionally written to the result cache with a TTL. An audit log entry is written with: user, query fingerprint, tables touched, bytes scanned, execution path, latency, and cache status." },
  { step: 9, title: "Response returned to client", detail: "The final result set is returned to the client over the Postgres wire protocol. The client has no visibility into which execution path was used." },
];

function LifecycleBlock() {
  return (
    <FadeUp className="mb-10">
      <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-2">Query lifecycle</h3>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">A complete walkthrough of what happens from the moment your client sends SQL to when it receives results.</p>
      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-zinc-200 dark:bg-white/10" />
        <StaggerList className="space-y-0">
          {LIFECYCLE_STEPS.map((s) => (
            <motion.div key={s.step} variants={slideItem} className="flex gap-4 pb-5 relative">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/15 flex items-center justify-center text-xs font-mono text-zinc-500 dark:text-zinc-400 z-10 shadow-sm">
                {s.step}
              </div>
              <div className="flex-1 pt-2 min-w-0">
                <h4 className="font-heading font-semibold text-zinc-900 dark:text-white text-sm mb-1">{s.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </StaggerList>
      </div>
    </FadeUp>
  );
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Copy code">
      {copied ? <CheckIcon size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
}

function CodeBlock({ title, lang = "sql", children }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#080808] overflow-hidden my-5">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-white/8 bg-zinc-100 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
            <span className="ml-2 text-zinc-500 text-xs font-mono">{title}</span>
          </div>
          <CopyButton text={children} />
        </div>
      )}
      <pre className="p-5 text-sm font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto leading-relaxed whitespace-pre">{children}</pre>
    </div>
  );
}

function InlineCode({ children }) {
  return <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-mono">{children}</code>;
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "quickstart", label: "Quickstart" },
  { id: "configure-storage", label: "Configure Storage" },
  { id: "register-table", label: "Register a Table" },
  { id: "run-queries", label: "Run Your First Query" },
  { id: "verify-routing", label: "Verify Routing" },
  { id: "extension-reference", label: "Extension Reference" },
  { id: "query-limits", label: "Query Limits" },
  { id: "faq", label: "FAQ" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" data-testid="docs-back-home" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /><span>Home</span>
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">Docs</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 font-heading font-bold text-zinc-900 dark:text-white">
              <span className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-black">LB</span>
              <span className="hidden sm:block">LakeBridge</span>
            </a>
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} data-testid="docs-theme-toggle"
                className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 flex-shrink-0 sticky top-24 self-start">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">Documentation</p>
            <nav className="flex flex-col gap-1" data-testid="docs-sidebar">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)}
                  data-testid={`docs-nav-${s.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === s.id
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  }`}>
                  <ChevronRight size={12} className={activeSection === s.id ? "opacity-100" : "opacity-0"} />
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-3xl" data-testid="docs-content">
            {/* Overview */}
            <section id="overview" className="mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/30 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-xs text-blue-600 dark:text-blue-400 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                v0.1 · Private Beta
              </div>
              <h1 className="font-heading font-black text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight leading-tight mb-5">
                LakeBridge Docs
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                LakeBridge is a Postgres-native lakehouse access platform. Install the open-source Postgres extension to query Parquet and Iceberg files in S3, R2, or MinIO, using the same SQL endpoint your app already uses.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "< 5 min setup", desc: "From zero to first lake query" },
                  { title: "Standard SQL", desc: "No new query language to learn" },
                  { title: "Isolated workers", desc: "Zero impact on production Postgres" },
                ].map((c) => (
                  <div key={c.title} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/30">
                    <p className="font-heading font-semibold text-zinc-900 dark:text-white text-sm mb-1">{c.title}</p>
                    <p className="text-zinc-500 text-xs">{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Architecture */}
            <section id="architecture" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-2">Architecture</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                LakeBridge adds a transparent routing layer between your SQL clients and your data stores. There are no new endpoints to configure, no new query language to learn, and no change to your existing Postgres connection strings.
              </p>

              {/* System layers */}
              <LayersBlock />

              {/* Query lifecycle */}
              <LifecycleBlock />

              {/* Execution paths */}
              <div className="mb-10">
                <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-5">Execution paths</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: "Cache path", icon: "C", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15", desc: "Result matches a cached entry. Returned in microseconds. No scan, no worker.", latency: "Microseconds" },
                    { name: "Native path", icon: "P", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/15", desc: "Postgres-only query or recent-data query with no lake table references. Executes directly in Postgres.", latency: "Standard Postgres" },
                    { name: "Worker path", icon: "W", color: "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/15", desc: "Query references lake tables. Dispatched to an isolated worker that scans object storage directly.", latency: "1s to 30s" },
                  ].map((p) => (
                    <div key={p.name} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/30">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-3 ${p.color}`}>{p.icon}</div>
                      <h4 className="font-heading font-semibold text-zinc-900 dark:text-white text-sm mb-1">{p.name}</h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed mb-2">{p.desc}</p>
                      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">Typical latency: {p.latency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security model */}
              <div>
                <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-4">Security model</h3>
                <div className="space-y-3">
                  {[
                    { title: "Credentials are short-lived and query-scoped", desc: "Storage credentials are injected per-query at execution time. They are never stored in your Postgres config or persisted beyond the query lifetime." },
                    { title: "Workers are ephemeral and tenant-isolated", desc: "Each isolated worker runs in a sandboxed environment. Workers do not share state, file system access, or memory across tenants or queries." },
                    { title: "Lake data never enters Postgres", desc: "Intermediate results from lake scans are never written to Postgres storage. They are processed in-memory in the worker and streamed directly to the gateway." },
                    { title: "Policy enforced before execution", desc: "Access controls, byte limits, and concurrency limits are evaluated before a query reaches any execution path. A rejected query returns an error without touching storage." },
                    { title: "Full audit trail", desc: "Every query is logged with caller identity, query fingerprint, tables accessed, bytes scanned, execution path, and result status. Logs are tamper-evident and retained per your policy configuration." },
                  ].map((s) => (
                    <div key={s.title} className="flex gap-3 p-4 rounded-xl border border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-zinc-900/20">
                      <div className="w-1.5 flex-shrink-0 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1" />
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-white text-sm mb-1">{s.title}</h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Quickstart */}
            <section id="quickstart" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-3">Quickstart</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Get from install to your first cross-source query in under 5 minutes.</p>

              <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-2">Prerequisites</h3>
              <ul className="space-y-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                {["Postgres 13 or higher","S3, R2, or MinIO bucket containing Parquet or Iceberg files","psql or any Postgres-compatible client"].map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>

              <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-2">Step 1: Install the extension</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">Connect to your Postgres instance and run:</p>
              <CodeBlock title="psql">
{`-- Install the LakeBridge extension
CREATE EXTENSION lakebridge;

-- Verify installation
SELECT lakebridge.version();
-- Returns: lakebridge 0.1.0`}
              </CodeBlock>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Configure storage */}
            <section id="configure-storage" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-3">Configure Storage</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Tell LakeBridge where your lake data lives and how to authenticate. LakeBridge uses short-lived scoped credentials. Your S3 keys are never stored in Postgres.</p>

              <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-2">AWS S3 (IAM Role)</h3>
              <CodeBlock title="configure_s3.sql">
{`SELECT lakebridge.configure_storage(
  provider  := 's3',
  bucket    := 'my-data-lake',
  region    := 'us-east-1',
  role_arn  := 'arn:aws:iam::123456789012:role/LakeBridgeRole'
);`}
              </CodeBlock>

              <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-2 mt-8">Cloudflare R2</h3>
              <CodeBlock title="configure_r2.sql">
{`SELECT lakebridge.configure_storage(
  provider          := 'r2',
  bucket            := 'my-r2-bucket',
  account_id        := 'your-cf-account-id',
  access_key_id     := 'your-r2-access-key',
  secret_access_key := 'your-r2-secret'
);`}
              </CodeBlock>

              <div className="mt-6 p-4 rounded-xl border border-amber-400/20 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 text-sm text-amber-700 dark:text-amber-400">
                <strong>Note:</strong> In production, credentials are injected at query time via the managed credential service. They are never stored in your Postgres config.
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Register table */}
            <section id="register-table" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-3">Register a Lake Table</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Map an S3 prefix to a schema and table name in Postgres. This creates an <InlineCode>EXTERNAL TABLE</InlineCode> that behaves like a regular Postgres table in queries.</p>

              <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-2">Parquet</h3>
              <CodeBlock title="register_parquet.sql">
{`SELECT lakebridge.register_table(
  schema       := 'lake',
  name         := 'events',
  location     := 's3://my-data-lake/events/',
  format       := 'parquet',
  partition_by := ARRAY['year', 'month', 'day']
);`}
              </CodeBlock>

              <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-2 mt-8">Iceberg</h3>
              <CodeBlock title="register_iceberg.sql">
{`SELECT lakebridge.register_table(
  schema    := 'lake',
  name      := 'billing_events',
  location  := 's3://my-data-lake/billing/',
  format    := 'iceberg'
  -- Iceberg snapshot metadata is auto-resolved
);`}
              </CodeBlock>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-4">
                Tables registered under the <InlineCode>lake</InlineCode> schema are routed to isolated workers automatically. Tables in other schemas are treated as regular Postgres tables.
              </p>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Run queries */}
            <section id="run-queries" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-3">Run Your First Query</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Once your table is registered, query it from any Postgres client like any other table. Join it with Postgres tables seamlessly.</p>

              <CodeBlock title="first_query.sql">
{`-- Pure lake query, routed to isolated worker
SELECT COUNT(*) FROM lake.events
WHERE year = 2024 AND month = 11;

-- Cross-source JOIN: Postgres + S3/Parquet
SELECT
  u.plan,
  COUNT(DISTINCT e.user_id) AS active_users,
  SUM(e.revenue_cents) / 100.0 AS revenue
FROM users u                        -- Postgres table
JOIN lake.billing_events e          -- S3/Parquet
  ON u.id = e.user_id
WHERE e.ts >= now() - INTERVAL '30 days'
GROUP BY 1
ORDER BY revenue DESC;`}
              </CodeBlock>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-4">
                The query gateway automatically handles the routing. Postgres-only queries stay in Postgres. Queries touching <InlineCode>lake.*</InlineCode> tables are dispatched to an isolated DuckDB/DataFusion worker.
              </p>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Verify routing */}
            <section id="verify-routing" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-3">Verify Routing</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Use <InlineCode>lakebridge.explain_routing()</InlineCode> to see how the gateway will route a query before executing it.</p>

              <CodeBlock title="explain_routing.sql">
{`SELECT lakebridge.explain_routing($$
  SELECT * FROM lake.events
  WHERE year = 2024
  LIMIT 100
$$);

-- Output:
-- {
--   "route": "isolated_worker",
--   "worker_type": "duckdb",
--   "estimated_bytes": "2.1 GB",
--   "cache_status": "miss",
--   "partitions_pruned": 87,
--   "partitions_scanned": 3
-- }`}
              </CodeBlock>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Extension reference */}
            <section id="extension-reference" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-3">Extension Reference</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Core functions provided by the LakeBridge Postgres extension.</p>
              <div className="space-y-4">
                {[
                  { fn: "lakebridge.version()", returns: "text", desc: "Returns the installed LakeBridge extension version." },
                  { fn: "lakebridge.configure_storage(...)", returns: "void", desc: "Registers an object storage provider (S3, R2, MinIO) with connection credentials." },
                  { fn: "lakebridge.register_table(...)", returns: "void", desc: "Registers an external lake table under a given schema and name." },
                  { fn: "lakebridge.explain_routing(query text)", returns: "jsonb", desc: "Returns routing metadata for a given SQL query without executing it." },
                  { fn: "lakebridge.invalidate_cache(table text)", returns: "void", desc: "Clears all cached results for a given lake table." },
                  { fn: "lakebridge.audit_log(limit int)", returns: "setof record", desc: "Returns the N most recent query audit log entries." },
                ].map((fn) => (
                  <div key={fn.fn} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/30">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <InlineCode>{fn.fn}</InlineCode>
                      <span className="text-xs text-zinc-400 font-mono">→ {fn.returns}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">{fn.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* Query limits */}
            <section id="query-limits" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-3">Query Limits</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Protect against runaway queries and control costs with per-user and per-query limits.</p>
              <CodeBlock title="set_limits.sql">
{`-- Set limits for a specific role
SELECT lakebridge.set_limits(
  role              := 'analytics_team',
  max_bytes_scanned := '50 GB',
  timeout_ms        := 30000,        -- 30 second timeout
  max_concurrency   := 3             -- max parallel lake queries
);

-- Set global default limits
SELECT lakebridge.set_global_limits(
  max_bytes_scanned := '500 GB',
  timeout_ms        := 60000
);`}
              </CodeBlock>
            </section>

            <hr className="border-zinc-200 dark:border-white/5 mb-14" />

            {/* FAQ */}
            <section id="faq" className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white mb-6">FAQ</h2>
              <div className="space-y-6">
                {[
                  { q: "Does LakeBridge replace my Postgres database?", a: "No. LakeBridge extends it. Your Postgres instance remains the primary SQL endpoint. LakeBridge adds the ability to join Postgres tables with external lake data." },
                  { q: "What happens to my Postgres performance?", a: "Lake queries are routed to isolated workers and never execute inside your Postgres process. Your production database is fully protected." },
                  { q: "What file formats are supported?", a: "Parquet and Apache Iceberg (v1 and v2). Delta Lake support is on the roadmap." },
                  { q: "How does caching work?", a: "LakeBridge maintains a multi-layer cache: result cache (exact query results), metadata cache (file listing, schema), and hot partition cache (frequently accessed Parquet row groups)." },
                  { q: "Is the extension open source?", a: "Yes. The Postgres extension is MIT-licensed. The managed cloud layer (isolated worker pool, cache service, admin console) is a paid product." },
                ].map((faq) => (
                  <div key={faq.q}>
                    <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-base mb-2">{faq.q}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 rounded-xl border border-blue-400/20 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5 text-center">
              <p className="font-heading font-semibold text-zinc-900 dark:text-white mb-2">Ready to get started?</p>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Join our private beta and get early access to the managed cloud.</p>
              <a href="/#waitlist" className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors">
                Join the waitlist
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
