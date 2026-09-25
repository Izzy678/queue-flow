import { Reveal } from "@/components/motion/reveal";
import { trustedByLogos } from "@/lib/landing-data";

export function TrustedBy() {
  return (
    <section className="py-16 border-y border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-center text-sm text-muted mb-8">
            Built for teams that manage customer flow across locations
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedByLogos.map((logo) => (
              <span
                key={logo.name}
                className="text-sm font-medium text-muted opacity-70"
              >
                {logo.name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
