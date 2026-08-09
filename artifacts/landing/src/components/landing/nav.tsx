import { Waves } from "lucide-react";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white drop-shadow-md">
          <Waves className="w-5 h-5" />
          <span className="font-serif text-xl font-bold tracking-tight">Strony dla Ośrodków</span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-white/90 drop-shadow">
          <a href="#style" className="hover:text-white transition-colors">5 Stylów</a>
          <a href="#funkcje" className="hover:text-white transition-colors">Funkcje</a>
          <a href="#proces" className="hover:text-white transition-colors">Jak to działa</a>
        </nav>

        <a
          href="#kontakt"
          className="btn-ocean bg-white text-[hsl(199,88%,36%)] hover:bg-white/90 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg"
        >
          Kup teraz
        </a>
      </div>
    </header>
  );
}
