import { Reveal } from "@/components/motion/reveal";
import { ShowcasePanels } from "@/components/dashboard/showcase-panels";

export function ProductShowcase() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent mb-3">Product</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              See QueueFlow in action
            </h2>
            <p className="text-muted leading-relaxed">
              Monitor queues in real time, analyze performance across branches,
              and make data-driven decisions — all from one powerful dashboard.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ShowcasePanels />
        </Reveal>
      </div>
    </section>
  );
}
