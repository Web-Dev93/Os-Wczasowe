import { Waves } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Waves className="w-4 h-4" />
          <span className="font-serif text-lg">Strony dla Ośrodków</span>
        </div>
        <div className="text-sm text-muted-foreground flex gap-6 flex-wrap justify-center">
          <span>&copy; {new Date().getFullYear()} Strony dla Ośrodków. Wszystkie prawa zastrzeżone.</span>
          <a href="#kontakt" className="hover:text-foreground transition-colors">Kontakt</a>
        </div>
      </div>
    </footer>
  );
}
