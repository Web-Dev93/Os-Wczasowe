import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#funkcje",    label: "Funkcje" },
  { href: "#demo",       label: "6 Stylów" },
  { href: "#opinie",     label: "Opinie" },
  { href: "#cennik",     label: "Cennik" },
  { href: "#faq",        label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className={`font-serif text-xl font-semibold tracking-wide transition-colors ${scrolled ? "text-primary" : "text-white drop-shadow-md"}`}>
          Strony dla Ośrodków
        </div>

        {/* Desktop nav */}
        <nav className={`hidden md:flex gap-7 text-sm font-medium transition-colors ${scrolled ? "text-foreground/70" : "text-white/90 drop-shadow"}`}>
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className={`hover:${scrolled ? "text-primary" : "text-white"} transition-colors`}>
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#kontakt"
          className={`hidden md:block px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg ${
            scrolled
              ? "bg-primary text-white shadow-primary/25 hover:bg-primary/90"
              : "bg-white text-primary shadow-white/20 hover:bg-white/90"
          }`}
        >
          Kup teraz
        </a>

        {/* Mobile menu toggle */}
        <button
          className={`md:hidden p-2 rounded-lg ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-border px-6 py-4 space-y-3">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
            >
              {label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="block mt-2 bg-primary text-white text-center py-3 rounded-xl font-semibold"
          >
            Kup teraz — 1 200 zł
          </a>
        </div>
      )}
    </header>
  );
}
