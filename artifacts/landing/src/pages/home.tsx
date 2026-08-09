import { Hero } from "@/components/landing/hero";
import { Nav } from "@/components/landing/nav";
import { Problem } from "@/components/landing/problem";
import { Features } from "@/components/landing/features";
import { StylesShowcase } from "@/components/landing/styles-showcase";
import { Steps } from "@/components/landing/steps";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { CtaFinal } from "@/components/landing/cta-final";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Nav />
      <main className="flex-1">
        {/* 1. Uwaga — hero */}
        <Hero />
        {/* 2. Problem — ból */}
        <Problem />
        {/* 3. Funkcje — rozwiązanie + integracje */}
        <Features />
        {/* 4. Demo — 5 stylów na żywo */}
        <StylesShowcase />
        {/* 5. Jak to działa — 3 kroki */}
        <Steps />
        {/* 6. Opinie — social proof */}
        <Testimonials />
        {/* 7. Cennik — jedna cena */}
        <Pricing />
        {/* 8. FAQ — usuwanie obiekcji */}
        <Faq />
        {/* 9. Finalne CTA */}
        <CtaFinal />
        {/* 10. Formularz kontaktowy */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
