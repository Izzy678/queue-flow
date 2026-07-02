import { Reveal } from "@/components/motion/reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { features } from "@/lib/landing-data";

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to manage queues
            </h2>
            <p className="text-muted leading-relaxed">
              From digital ticketing to real-time analytics, QueueFlow gives you
              the tools to deliver exceptional customer experiences at every
              touchpoint.
            </p>
          </div>
        </Reveal>

        <StaggerChildren
          className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border"
          childClassName="group border-r border-b border-border p-8 transition-colors duration-300 hover:bg-surface"
          staggerDelay={0.08}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft mb-4 group-hover:bg-accent/20 transition-colors">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </>
  );
}
