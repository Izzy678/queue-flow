import { Reveal } from "@/components/motion/reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { benefits } from "@/lib/landing-data";

export function Benefits() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent mb-3">Benefits</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Results that speak for themselves
            </h2>
            <p className="text-muted leading-relaxed">
              Businesses using QueueFlow see measurable improvements in customer
              satisfaction, operational efficiency, and revenue.
            </p>
          </div>
        </Reveal>

        <StaggerChildren
          className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border"
          childClassName="border-r border-b border-border p-8 text-center transition-colors duration-300 hover:bg-surface"
          staggerDelay={0.1}
        >
          {benefits.map((benefit) => (
            <div key={benefit.label}>
              <div className="text-3xl md:text-4xl font-bold tracking-tight gradient-text mb-2">
                {benefit.metric}
              </div>
              <h3 className="text-sm font-semibold mb-2">{benefit.label}</h3>
              <p className="text-xs text-muted leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
