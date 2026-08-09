export function Steps() {
  return (
    <section id="proces" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Jak to działa?</h2>
          <p className="text-lg text-muted-foreground">
            Trzy proste kroki dzielą Cię od nowej, profesjonalnej strony Twojego obiektu. Zero stresu, pełne wsparcie.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-border -z-10"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-background border border-border rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-6 shadow-sm">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Wybierz styl</h3>
            <p className="text-muted-foreground">
              Przejrzyj nasze style, wybierz ten, który najlepiej pasuje do Twojego ośrodka i wyślij nam formularz kontaktowy.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-6 shadow-md">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">Prześlij materiały</h3>
            <p className="text-muted-foreground">
              Wysyłasz nam opisy, cennik i zdjęcia. My zajmujemy się resztą — instalujemy system na Twojej domenie i uzupełniamy treść.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-background border border-border rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-6 shadow-sm">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Gotowe!</h3>
            <p className="text-muted-foreground">
              Otrzymujesz klucze do panelu admina. Twoja nowa strona działa i sprzedaje noclegi. Możesz w pełni nią zarządzać.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
