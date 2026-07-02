import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardMock } from "@/components/dashboard/dashboard-mock";
import { FloatingTicket } from "@/components/dashboard/floating-ticket";
import { Float } from "@/components/motion/float";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { heroStats } from "@/lib/landing-data";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-muted mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Now serving 2.4M+ customers worldwide
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Eliminate waiting.
                <br />
                <span className="gradient-text">Delight every customer.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg text-muted max-w-lg mb-8 leading-relaxed">
                QueueFlow transforms how businesses manage customer flow. Digital
                queues, real-time updates, and smart analytics — so your
                customers never waste time waiting again.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/register">
                  <Button variant="gradient" size="lg">
                    Start free trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  <Play className="h-4 w-4" />
                  Watch demo
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex gap-8 md:gap-12">
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl md:text-3xl font-bold tracking-tight">
                      <CountUp
                        end={stat.value}
                        decimals={stat.suffix === "M+" ? 1 : 0}
                        suffix={stat.suffix}
                      />
                    </div>
                    <p className="text-xs text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2}>
            <div className="relative">
              <DashboardMock />

              <Float
                className="absolute -top-4 -right-4 md:-right-8 z-10"
                delay={0}
                duration={5}
              >
                <FloatingTicket
                  ticketNumber="B-018"
                  status="called"
                  service="Priority"
                  waitTime="1 min"
                />
              </Float>

              <Float
                className="absolute -bottom-6 -left-4 md:-left-8 z-10"
                delay={1.5}
                duration={6}
              >
                <FloatingTicket
                  ticketNumber="A-043"
                  status="waiting"
                  service="General"
                  waitTime="8 min"
                />
              </Float>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
