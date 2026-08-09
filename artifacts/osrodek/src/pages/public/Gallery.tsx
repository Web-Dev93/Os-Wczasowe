import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListGallery } from "@workspace/api-client-react";
const galleryImg1 = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
const galleryImg2 = "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80";

export default function Gallery() {
  const { data: photos, isLoading } = useListGallery();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Ładowanie...</div>;
  }

  // Fallback if empty
  const displayPhotos = photos && photos.length > 0 
    ? photos 
    : [
        { id: 1, url: galleryImg1, caption: "Plaża o wschodzie słońca", sortOrder: 1 },
        { id: 2, url: galleryImg2, caption: "Wydmy i ścieżka", sortOrder: 2 },
      ];

  return (
    <div className="w-full pb-24">
      <section className="page-banner bg-primary text-primary-foreground py-16 md:py-24 pb-24 mb-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Galeria</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Zobacz, jak pięknie jest w naszym ośrodku i w jego najbliższej okolicy.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {displayPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm gallery-item-tint"
              onClick={() => setActiveImage(photo.url)}
            >
              <img 
                src={photo.url} 
                alt={photo.caption || "Zdjęcie z galerii"} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                {photo.caption && (
                  <p className="text-white font-medium drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {photo.caption}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setActiveImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              onClick={() => setActiveImage(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img 
              src={activeImage} 
              alt="Powiększenie" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
