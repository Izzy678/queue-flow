import { Reveal } from "@/components/motion/reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { testimonials } from "@/lib/landing-data";

export function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-accent mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Loved by operations teams
            </h2>
            <p className="text-muted leading-relaxed">
              See why businesses across healthcare, banking, government, and
              retail choose QueueFlow.
            </p>
          </div>
        </Reveal>

        <StaggerChildren
          className="grid md:grid-cols-3 border-t border-l border-border"
          childClassName="flex border-r border-b border-border p-8 transition-colors duration-300 hover:bg-surface"
          staggerDelay={0.1}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="flex flex-1 flex-col">
              <p className="text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonial.author}</p>
                  <p className="text-xs text-muted">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
