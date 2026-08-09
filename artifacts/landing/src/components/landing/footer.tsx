export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-serif text-xl font-medium tracking-tight">
          Strony dla Ośrodków
        </div>
        <div className="text-sm text-muted-foreground flex gap-6">
          <span>&copy; {new Date().getFullYear()} Wszelkie prawa zastrzeżone.</span>
          <a href="#kontakt" className="hover:text-foreground transition-colors">Kontakt</a>
        </div>
      </div>
    </footer>
  );
}