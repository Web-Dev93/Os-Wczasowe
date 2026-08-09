import { Hero } from "@/components/landing/hero";
import { Nav } from "@/components/landing/nav";
import { StylesShowcase } from "@/components/landing/styles-showcase";
import { Features } from "@/components/landing/features";
import { Steps } from "@/components/landing/steps";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Nav />
      <main className="flex-1">
        <Hero />
        <StylesShowcase />
        <Features />
        <Steps />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
