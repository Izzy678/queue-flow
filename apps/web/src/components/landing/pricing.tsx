import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted leading-relaxed">
              Start with a 14-day free trial. No credit card required. Scale as
              you grow.
            </p>
          </div>
        </Reveal>

        <StaggerChildren
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.1}
        >
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "rounded-xl border p-6 flex flex-col relative",
                tier.highlighted
                  ? "border-accent bg-surface-elevated shadow-lg shadow-accent/10 gradient-border"
                  : "border-border bg-surface-elevated"
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
                    Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                <p className="text-xs text-muted mb-4">{tier.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-muted">{tier.period}</span>
                  )}
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlighted ? "gradient" : "outline"}
                className="w-full"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
