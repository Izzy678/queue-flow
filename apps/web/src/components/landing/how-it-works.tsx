import { Reveal } from "@/components/motion/reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { howItWorksSteps } from "@/lib/landing-data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Four steps to a better experience
            </h2>
            <p className="text-muted leading-relaxed">
              QueueFlow makes it effortless for customers to join, wait, and get
              served — without the frustration of traditional queues.
            </p>
          </div>
        </Reveal>

        <StaggerChildren
          className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border"
          childClassName="border-r border-b border-border p-8 transition-colors duration-300 hover:bg-surface"
          staggerDelay={0.12}
        >
          {howItWorksSteps.map((step) => (
            <div key={step.step}>
              <div className="text-5xl font-bold text-zinc-200 mb-4 select-none">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
