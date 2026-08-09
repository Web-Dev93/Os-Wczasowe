import adminImg from "@assets/generated_images/admin-panel.jpg";
import { Check } from "lucide-react";

const FEATURES = [
  "Strona główna z animacjami i galerią w tle",
  "Katalog pokoi z cennikiem i udogodnieniami",
  "System zapytań lub rezerwacji online",
  "Galeria zdjęć w układzie masonry",
  "Responsywność (Mobile-first)",
  "Szybkie ładowanie (SEO-friendly)",
  "Gotowa strona kontaktu z mapą",
];

export function Features() {
  return (
    <section id="funkcje" className="py-24 px-6 container mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Wszystko, czego potrzebujesz</h2>
        <p className="text-lg text-muted-foreground">
          Żadnych półśrodków. Dostajesz kompletną platformę gotową do sprzedaży noclegów. Zbudowaną z myślą o Twoich gościach.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-6">Twoja własna niezależna strona</h3>
          <ul className="space-y-4 mb-10">
            {FEATURES.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground p-1 rounded-full shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-lg">{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="p-8 bg-card border border-border rounded-xl shadow-sm">
            <h4 className="font-serif font-bold text-xl mb-3">Ty rządzisz (Panel Administratora)</h4>
            <p className="text-muted-foreground mb-4">
              W zestawie otrzymujesz dedykowany, bezpieczny panel zarządzania. Zmienisz zdjęcia, zaktualizujesz ceny pokoi, dodasz nową galerię. Szybko i bez pisania kodu.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2 items-center"><Check className="w-3 h-3"/> Zarządzanie pokojami</li>
              <li className="flex gap-2 items-center"><Check className="w-3 h-3"/> Zarządzanie galerią</li>
              <li className="flex gap-2 items-center"><Check className="w-3 h-3"/> Przegląd rezerwacji</li>
            </ul>
          </div>
        </div>
        
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
          <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto bg-background px-3 py-1 rounded-md text-xs text-muted-foreground w-1/2 text-center border border-border">
              admin.twojastrona.pl
            </div>
          </div>
          <img 
            src={adminImg} 
            alt="Panel Administratora" 
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
