import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "#funkcje",    label: "Funkcje" },
  { href: "#demo",       label: "Motywy" },
  { href: "#opinie",     label: "Opinie" },
  { href: "#cennik",     label: "Cennik" },
  { href: "#faq",        label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-border/50 py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className={`font-serif text-xl font-medium tracking-tight transition-colors duration-500 ${scrolled ? "text-foreground" : "text-white"}`}>
          Strony dla Ośrodków
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map(({ href, label }) => (
            <a 
              key={href} 
              href={href} 
              className={`transition-colors duration-300 ${scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"}`}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#kontakt"
          className={`hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded text-sm font-semibold transition-all duration-300 ${
            scrolled
              ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
              : "bg-white text-foreground hover:bg-white/90 shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)]"
          }`}
        >
          Napisz do nas
        </a>

        {/* Mobile menu toggle */}
        <button
          className={`md:hidden p-2 -mr-2 transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border shadow-lg"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-serif text-foreground/80 hover:text-foreground"
                >
                  {label}
                </a>
              ))}
              <div className="pt-4 border-t border-border mt-2">
                <a
                  href="#kontakt"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full bg-accent text-accent-foreground py-3.5 rounded font-semibold text-sm shadow-sm"
                >
                  Napisz do nas
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}