import React from "react";
import { Zap, CloudOff, Layers } from "lucide-react";
import AnimatedSection, { AnimatedStagger, staggerItem } from "./AnimatedSection";
import { motion } from "framer-motion";

const problems = [
  {
    icon: <Zap size={20} className="text-orange-500 dark:text-orange-400" />,
    title: "Analytics queries are killing your Postgres",
    description: "Heavy scans on large tables cause lock contention, CPU spikes, and slow response times for your users. You can't run analytics on production.",
  },
  {
    icon: <CloudOff size={20} className="text-red-500 dark:text-red-400" />,
    title: "Your lake data lives in a silo",
    description: "Historical data in S3 or R2 is only reachable through Athena, Spark, or custom ETL jobs. Your SQL tools can't see it. Your team can't query it.",
  },
  {
    icon: <Layers size={20} className="text-yellow-500 dark:text-yellow-400" />,
    title: "You're maintaining too many systems",
    description: "AWS Glue + Athena, Databricks, or Trino. Just to answer: 'How many enterprise users churned last quarter?' That's the wrong trade-off.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" data-testid="problem-section" className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">The problem</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight leading-tight">
            Your data is split.
            <br />
            <span className="text-zinc-500">Your queries shouldn't be.</span>
          </h2>
          <p className="mt-5 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            Every Postgres-first team hits the same wall. Transactional data in Postgres, historical data in object storage, with no clean way to query both without rebuilding your entire data stack.
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((item, i) => (
            <motion.div key={i} variants={staggerItem} data-testid={`problem-card-${i}`}
              className="p-6 rounded-xl border border-zinc-200 dark:border-white/8 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-white/15 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-4 group-hover:-translate-y-0.5 transition-transform duration-200 shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg mb-3 leading-snug">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </AnimatedStagger>

        <AnimatedSection delay={0.2} className="mt-16 pt-12 border-t border-zinc-100 dark:border-white/5">
          <blockquote className="max-w-2xl text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed italic">
            "We had 3 engineers maintaining a Glue + Athena pipeline just to power our billing dashboard. It broke every time we changed a schema."
          </blockquote>
          <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-600">— Engineering lead, B2B SaaS (120 employees)</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
