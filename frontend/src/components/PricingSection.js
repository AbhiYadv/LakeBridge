import React from "react";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Open Source",
    price: "Free",
    priceNote: "self-hosted",
    description:
      "The core LakeBridge Postgres extension. Open source, MIT-licensed, runs anywhere Postgres runs.",
    cta: "View on GitHub",
    ctaHref: "https://github.com",
    ctaStyle: "secondary",
    features: [
      "Postgres extension (MIT licensed)",
      "Query routing to isolated workers",
      "Parquet + Iceberg support",
      "S3 / R2 / MinIO connectors",
      "Community support",
      "Self-hosted deployment",
    ],
    highlight: false,
  },
  {
    name: "Cloud",
    price: "Waitlist",
    priceNote: "managed · private beta",
    description:
      "Managed isolated worker pool, cache, audit logs, and cost controls. We run the infrastructure. You run the queries.",
    cta: "Join the waitlist",
    ctaHref: "#waitlist",
    ctaStyle: "primary",
    features: [
      "Everything in Open Source",
      "Managed isolated worker pool",
      "Multi-layer result cache",
      "Query limits & cost controls",
      "Audit logs & observability",
      "Admin console",
      "Auto-scaling workers",
      "Email support",
    ],
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "contact us",
    description:
      "Dedicated infrastructure, SLA guarantees, private networking, and hands-on onboarding for larger teams.",
    cta: "Contact us",
    ctaHref: "mailto:hello@lakebridge.dev",
    ctaStyle: "secondary",
    features: [
      "Everything in Cloud",
      "Private networking (VPC peering)",
      "Dedicated worker fleet",
      "SLA with uptime guarantees",
      "SSO / SAML integration",
      "Custom retention & compliance",
      "Dedicated Slack channel",
      "Enterprise onboarding",
    ],
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-4">
            Pricing
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Start open source.
            <br />
            <span className="text-zinc-500">Scale on cloud.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={i}
              data-testid={`pricing-card-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`relative rounded-xl border p-6 flex flex-col gap-6 ${
                tier.highlight
                  ? "border-blue-500/40 bg-blue-500/5"
                  : "border-white/10 bg-zinc-900/30"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                  {tier.badge}
                </span>
              )}

              {/* Header */}
              <div>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-2">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-heading font-bold text-3xl text-white">
                    {tier.price}
                  </span>
                  <span className="text-zinc-500 text-sm">{tier.priceNote}</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* CTA */}
              <a
                href={tier.ctaHref}
                data-testid={`pricing-cta-${i}`}
                className={`block text-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                  tier.ctaStyle === "primary"
                    ? "bg-white text-black hover:bg-zinc-100"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {tier.cta}
              </a>

              {/* Feature list */}
              <ul className="flex flex-col gap-2.5">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${
                        tier.highlight ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    />
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
