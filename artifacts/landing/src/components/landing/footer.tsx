export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="font-serif text-xl font-bold mb-4 md:mb-0">
          Pracownia WWW.
        </div>
        <div className="text-sm text-muted-foreground flex gap-6">
          <span>&copy; {new Date().getFullYear()} Pracownia WWW. Wszystkie prawa zastrzeżone.</span>
          <a href="#" className="hover:text-foreground transition-colors">Polityka prywatności</a>
        </div>
      </div>
    </footer>
  );
}
