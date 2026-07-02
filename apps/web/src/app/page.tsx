import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { Benefits } from "@/components/landing/benefits";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="aurora-bg" aria-hidden="true" />
      <div className="grid-pattern fixed inset-0 pointer-events-none" aria-hidden="true" />

      <Navbar />

      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <ProductShowcase />
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
