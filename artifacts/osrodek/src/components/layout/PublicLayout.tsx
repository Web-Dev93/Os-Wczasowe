import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { usePublicTheme } from "../../hooks/use-theme";
import { Menu, X, Phone, Mail, MapPin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { settings, isLoading } = usePublicTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  if (isLoading && !settings) return <div className="min-h-screen bg-background flex items-center justify-center">Ładowanie...</div>;

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Strona główna" },
    { href: "/pokoje", label: "Pokoje" },
    { href: "/galeria", label: "Galeria" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Top Bar */}
      <div className="topbar-shine bg-primary text-primary-foreground py-2 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-6">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:opacity-80 transition">
                <Phone className="w-4 h-4" /> {settings.phone}
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:opacity-80 transition">
                <Mail className="w-4 h-4" /> {settings.email}
              </a>
            )}
            {settings?.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {settings.address}
              </div>
            )}
          </div>
          {settings?.facebook && (
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition flex items-center gap-2">
              <Facebook className="w-4 h-4" /> Facebook
            </a>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
          <Link href="/" className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.resortName || "Logo"} className="h-10 w-auto object-contain" />
            ) : (
              <span className="font-serif text-2xl font-bold text-primary tracking-tight">{settings?.resortName || "Ośrodek Wypoczynkowy"}</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </Link>
            ))}
            <Button asChild size="lg" className="rounded-full px-8 shadow-md btn-cta-glow">
              <Link href="/rezerwacja">Rezerwacja</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 -mr-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[80px] z-40 bg-background flex flex-col p-6 animate-in slide-in-from-right-4 md:hidden">
          <nav className="flex flex-col gap-6 text-xl font-serif">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu} className={`block pb-2 border-b ${location === link.href ? "text-primary border-primary" : "text-foreground border-border"}`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-6">
              <Button asChild size="lg" className="w-full text-lg h-14 rounded-full">
                <Link href="/rezerwacja" onClick={closeMenu}>Rezerwacja</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer-wave bg-primary text-primary-foreground py-12 md:py-16 mt-auto">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">{settings?.resortName || "Nasz Ośrodek"}</h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed max-w-sm">
              {settings?.description ? settings.description.substring(0, 150) + "..." : "Odkryj prawdziwy urok Bałtyku w naszym przytulnym ośrodku. Sól, piasek i szum fal na wyciągnięcie ręki."}
            </p>
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition">
                <Facebook className="w-5 h-5" />
              </a>
            )}
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-primary-foreground/60">Szybkie linki</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline hover:text-white transition text-primary-foreground/80">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-primary-foreground/60">Kontakt</h4>
            <ul className="space-y-4">
              {settings?.address && (
                <li className="flex gap-3 text-primary-foreground/80">
                  <MapPin className="w-5 h-5 shrink-0 text-primary-foreground/60" /> 
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex gap-3 text-primary-foreground/80">
                  <Phone className="w-5 h-5 shrink-0 text-primary-foreground/60" /> 
                  <a href={`tel:${settings.phone}`} className="hover:underline">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex gap-3 text-primary-foreground/80">
                  <Mail className="w-5 h-5 shrink-0 text-primary-foreground/60" /> 
                  <a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-6xl mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-primary-foreground/50 text-sm">
          <span>&copy; {new Date().getFullYear()} {settings?.resortName || "Ośrodek Nadmorski"}. Wszelkie prawa zastrzeżone.</span>
          <a
            href={typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1"
              ? "/admin/login?demo=1"
              : "/admin"}
            className="text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors text-xs tracking-wide"
          >
            Panel administratora →
          </a>
        </div>
      </footer>
    </div>
  );
}
