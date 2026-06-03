import React from "react";
import { Shield, Zap, BookOpen, DollarSign, Clock, GitBranch } from "lucide-react";
import AnimatedSection, { AnimatedStagger, staggerItem } from "./AnimatedSection";
import { motion } from "framer-motion";

const features = [
  { icon: <BookOpen size={18} className="text-emerald-500 dark:text-emerald-400" />, title: "Audit Logs", description: "Every query logged: user, timestamp, tables touched, bytes scanned, cache hit, latency, and result status. Full traceability for compliance and debugging.", tag: "Observability" },
  { icon: <DollarSign size={18} className="text-emerald-500 dark:text-emerald-400" />, title: "Cost Controls", description: "Estimate scan cost before execution. Set team-level or query-level budgets. Know what a query will cost before it runs.", tag: "Control" },
  { icon: <Clock size={18} className="text-orange-500 dark:text-orange-400" />, title: "Query Limits", description: "Set max bytes scanned, execution timeouts, and per-user concurrency limits. Prevent runaway queries from burning your cloud bill.", tag: "Control" },
  { icon: <Shield size={18} className="text-blue-500 dark:text-blue-400" />, title: "Isolated Worker Pool", description: "Heavy lake scans run in a dedicated pool, completely separate from your Postgres production instance. Your users never feel a slow analytics query.", tag: "Core" },
  { icon: <Zap size={18} className="text-yellow-500 dark:text-yellow-400" />, title: "Multi-layer Cache", description: "Result cache, metadata cache, hot partition cache. Dashboard queries that used to run in 30 seconds return in milliseconds.", tag: "Performance" },
  { icon: <GitBranch size={18} className="text-violet-500 dark:text-violet-400" />, title: "Intelligent Query Routing", description: "The gateway automatically decides: serve from cache, run in Postgres (for recent data), or dispatch to an isolated worker (for lake scans). Transparent to your queries.", tag: "Core" },
];

export default function FeaturesSection() {
  return (
    <section id="features" data-testid="features-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">Features</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight leading-tight">
            Production-grade controls.
            <br /><span className="text-zinc-500">Built for Postgres teams.</span>
          </h2>
        </AnimatedSection>

        <AnimatedStagger data-testid="features-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div key={i} variants={staggerItem} data-testid={`feature-card-${i}`}
              className="group relative rounded-xl border border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-zinc-900/30 p-6 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5">
              <span className="inline-block px-2 py-0.5 rounded text-xs text-zinc-500 bg-zinc-200 dark:bg-zinc-800/80 border border-zinc-300 dark:border-white/8 mb-4 font-mono">{feature.tag}</span>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-300 dark:group-hover:border-white/20 shadow-sm transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-base leading-snug pt-1">{feature.title}</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
