import { motion } from "framer-motion";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="font-serif text-2xl font-bold tracking-tight">
          Pracownia WWW.
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#style" className="hover:text-muted-foreground transition-colors">Style</a>
          <a href="#funkcje" className="hover:text-muted-foreground transition-colors">Funkcje</a>
          <a href="#proces" className="hover:text-muted-foreground transition-colors">Jak to działa</a>
        </nav>
        <div>
          <a href="#kontakt" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Zamów stronę
          </a>
        </div>
      </div>
    </header>
  );
}
