import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Tag, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

const posts = [
  {
    id: "lakebridge-beta-launch",
    date: "Jan 15, 2026",
    type: "announcement",
    version: null,
    title: "LakeBridge private beta is open",
    summary: "After 6 months of internal development, we're opening LakeBridge to our first cohort of Postgres-first teams. We built this because we were tired of the complexity tax of modern data stacks.",
    tags: ["Announcement", "Beta"],
    readTime: "4 min read",
    content: `We spent the last 6 months talking to engineering teams at fast-growing SaaS companies. The pattern was always the same: a solid Postgres backend, years of event data in S3, and a growing list of analytics queries that couldn't be answered without spinning up another tool.

LakeBridge is our answer to that. One Postgres endpoint. Query your transactional data and your lake data with the same SQL your team already knows.

The private beta opens today. If you're on the waitlist, check your inbox.`,
  },
  {
    id: "v0-1-0-release",
    date: "Jan 10, 2026",
    type: "release",
    version: "v0.1.0",
    title: "LakeBridge v0.1.0: Initial release",
    summary: "First public release of the LakeBridge Postgres extension. Supports Parquet and Iceberg on S3/R2/MinIO, with isolated worker routing, result cache, and query limits.",
    tags: ["Release", "Extension"],
    readTime: "3 min read",
    content: null,
    changelog: [
      { type: "new", text: "Postgres extension with `lake` schema support" },
      { type: "new", text: "S3, R2, and MinIO storage connectors" },
      { type: "new", text: "Parquet and Apache Iceberg (v1, v2) format support" },
      { type: "new", text: "Query Gateway with automatic routing (cache / Postgres / worker)" },
      { type: "new", text: "Isolated worker pool with concurrency controls" },
      { type: "new", text: "Multi-layer result cache (query, metadata, hot partition)" },
      { type: "new", text: "`lakebridge.explain_routing()` function for pre-execution routing inspection" },
      { type: "new", text: "Per-role query limits: max bytes scanned, timeout, max concurrency" },
      { type: "new", text: "Full audit log via `lakebridge.audit_log()`" },
      { type: "new", text: "Admin console (cloud plan)" },
    ],
  },
  {
    id: "why-postgres-first",
    date: "Dec 20, 2025",
    type: "engineering",
    version: null,
    title: "Why we built on top of Postgres instead of beside it",
    summary: "Most analytics tools sit next to your database. LakeBridge extends it. Here's why that distinction matters for teams who want warehouse-like access without the warehouse operational burden.",
    tags: ["Engineering", "Product"],
    readTime: "7 min read",
    content: `The dominant pattern for adding analytics capability to a SaaS product is: sync your data to a separate warehouse, run queries there, and bridge the results back.

That works at scale. But there's a cost: latency, sync lag, schema management overhead, and another system to operate.

For the majority of Postgres-first teams (companies with under 50 TB of data and under 20 engineers) the juice isn't worth the squeeze.

LakeBridge takes a different approach: extend Postgres to understand lake tables natively. Your app sees one database. Your queries join Postgres rows and Parquet files. The complexity is hidden inside the extension.`,
  },
  {
    id: "iceberg-support",
    date: "Dec 10, 2025",
    type: "feature",
    version: null,
    title: "Apache Iceberg support is here",
    summary: "LakeBridge now supports querying Apache Iceberg tables (v1 and v2), including time-travel queries, snapshot inspection, and schema evolution. No data migration required.",
    tags: ["Feature", "Iceberg"],
    readTime: "5 min read",
    content: null,
    changelog: [
      { type: "new", text: "Iceberg v1 and v2 table format support" },
      { type: "new", text: "Time-travel queries via `AS OF TIMESTAMP` syntax" },
      { type: "new", text: "Snapshot inspection with `lakebridge.list_snapshots()`" },
      { type: "new", text: "Schema evolution: added/removed columns are handled automatically" },
      { type: "fix", text: "Partition pruning now works correctly for nested partition specs" },
    ],
  },
];

const TYPE_STYLES = {
  announcement: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
  release: "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400",
  engineering: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400",
  feature: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

const CHANGE_DOT = {
  new: "bg-emerald-500",
  fix: "bg-blue-500",
  improvement: "bg-amber-500",
  deprecation: "bg-red-500",
};

function PostCard({ post, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group p-6 rounded-xl border border-zinc-200 dark:border-white/8 bg-white dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-white/15 transition-all duration-200 cursor-pointer"
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-zinc-400 dark:text-zinc-600 text-xs font-mono">{post.date}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_STYLES[post.type]}`}>
          {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
        </span>
        {post.version && (
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono border border-zinc-200 dark:border-white/8">
            {post.version}
          </span>
        )}
      </div>

      <h2 className="font-heading font-bold text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
        {post.title}
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">{post.summary}</p>

      {post.changelog && (
        <ul className="space-y-1.5 mb-4">
          {post.changelog.slice(0, 4).map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-500">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${CHANGE_DOT[c.type] || "bg-zinc-400"}`} />
              {c.text}
            </li>
          ))}
          {post.changelog.length > 4 && (
            <li className="text-xs text-zinc-400 dark:text-zinc-600 pl-3.5">+{post.changelog.length - 4} more changes</li>
          )}
        </ul>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800">
              <Tag size={10} />{tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-600 flex items-center gap-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {post.readTime} <ArrowRight size={12} />
        </span>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const filters = ["all", "announcement", "release", "feature", "engineering"];
  const filtered = filter === "all" ? posts : posts.filter((p) => p.type === filter);
  const post = selected ? posts.find((p) => p.id === selected) : null;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" data-testid="blog-back-home" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /><span>Home</span>
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            {post ? (
              <>
                <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Blog</button>
                <span className="text-zinc-300 dark:text-zinc-700">/</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-xs">{post.title}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">Blog & Changelog</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 font-heading font-bold text-zinc-900 dark:text-white">
              <span className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-black">LB</span>
              <span className="hidden sm:block">LakeBridge</span>
            </a>
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} data-testid="blog-theme-toggle"
                className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {post ? (
          /* Single post view */
          <article className="max-w-2xl">
            <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to blog
            </button>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-zinc-400 dark:text-zinc-600 text-xs font-mono">{post.date}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_STYLES[post.type]}`}>
                {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </span>
              {post.version && (
                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono border border-zinc-200 dark:border-white/8">{post.version}</span>
              )}
            </div>
            <h1 className="font-heading font-black text-3xl md:text-4xl text-zinc-900 dark:text-white mb-5 leading-tight">{post.title}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-8">{post.summary}</p>
            {post.content && (
              <div className="prose-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-4">
                {post.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
            {post.changelog && (
              <div className="mt-8 p-5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/30">
                <p className="font-heading font-semibold text-zinc-900 dark:text-white text-sm mb-4">Full changelog</p>
                <ul className="space-y-2.5">
                  {post.changelog.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${CHANGE_DOT[c.type] || "bg-zinc-400"}`} />
                      <span>
                        <span className="text-xs font-mono uppercase text-zinc-400 dark:text-zinc-600 mr-2">{c.type}</span>
                        {c.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ) : (
          /* Blog listing */
          <>
            <div className="mb-10">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-3">Updates</p>
              <h1 className="font-heading font-black text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight mb-4">
                Blog & Changelog
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl">
                Product updates, engineering deep-dives, and release notes from the LakeBridge team.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-8" data-testid="blog-filters">
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} data-testid={`blog-filter-${f}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                      : "text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4" data-testid="blog-posts-list">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => setSelected(post.id)} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-zinc-400 dark:text-zinc-600">
                No posts in this category yet.
              </div>
            )}

            <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-zinc-500 text-sm">Stay up to date with LakeBridge releases</p>
              <a href="/#waitlist" className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors">
                Join the waitlist
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
