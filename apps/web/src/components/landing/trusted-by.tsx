import { Reveal } from "@/components/motion/reveal";
import { trustedByLogos } from "@/lib/landing-data";

export function TrustedBy() {
  return (
    <section className="py-16 border-y border-border">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-center text-sm text-muted mb-8">
            Trusted by forward-thinking teams worldwide
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {trustedByLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2.5 opacity-50 hover:opacity-80 transition-opacity"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-elevated text-xs font-bold text-muted">
                  {logo.initials}
                </div>
                <span className="text-sm font-medium text-muted hidden sm:inline">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
