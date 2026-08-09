import { motion } from "framer-motion";
import heroCraftsman from "@assets/generated_images/hero-craftsman.jpg";

export function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 container mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block py-1 px-3 border border-border rounded-full text-xs font-medium uppercase tracking-wider mb-6">
              Dla małych ośrodków i pensjonatów
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-6">
              Gotowa strona. <br />
              <span className="text-muted-foreground">Uszyta na miarę.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Zapomnij o abonamentach i skomplikowanych kreatorach. Kupujesz solidną, rzemieślniczą stronę z panelem admina. Działa od razu, wygląda doskonale. Płacisz raz, używasz lata.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#style" className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-center font-medium hover:bg-primary/90 transition-colors text-lg">
                Zobacz dostępne style
              </a>
              <a href="#proces" className="border border-border bg-card px-8 py-4 rounded-md text-center font-medium hover:bg-accent transition-colors text-lg">
                Jak to działa?
              </a>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden border border-border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img 
            src={heroCraftsman} 
            alt="Craftsman working on a website" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}
