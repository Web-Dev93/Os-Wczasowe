import React, { useState } from "react";
import {
  useAdminListGallery,
  useAdminAddGalleryPhoto,
  useAdminDeleteGalleryPhoto,
  getAdminListGalleryQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { AdminTip } from "@/components/ui/admin-help";

export default function AdminGallery() {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  const { data: photos, isLoading } = useAdminListGallery();
  const addPhoto = useAdminAddGalleryPhoto();
  const deletePhoto = useAdminDeleteGalleryPhoto();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({ title: "Podaj URL zdjęcia", variant: "destructive" });
      return;
    }

    addPhoto.mutate(
      { data: { url: url.trim(), caption: caption.trim() || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Zdjęcie dodane" });
          queryClient.invalidateQueries({ queryKey: getAdminListGalleryQueryKey() });
          setUrl("");
          setCaption("");
        },
        onError: () =>
          toast({ title: "Błąd podczas dodawania", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;
    deletePhoto.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Zdjęcie usunięte" });
          queryClient.invalidateQueries({ queryKey: getAdminListGalleryQueryKey() });
        },
        onError: () =>
          toast({ title: "Błąd podczas usuwania", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Galeria</h1>
        <p className="text-muted-foreground mt-1">Zarządzaj zdjęciami w galerii publicznej</p>
      </div>

      <AdminTip text="Zdjęcia z galerii wyświetlają się na publicznej stronie w zakładce 'Galeria' oraz w podglądzie na stronie głównej. Wklej link (URL) do zdjęcia — np. ze swojego Google Drive, Dropbox lub serwisu Unsplash.com (darmowe zdjęcia)." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Photo Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Dodaj zdjęcie
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL zdjęcia *</label>
                  <Input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <AdminTip text="Skopiuj i wklej link do zdjęcia. Link musi zaczynać się od https:// i kończyć rozszerzeniem .jpg lub .png." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Podpis (opcjonalnie)</label>
                  <Input
                    placeholder="Np. Widok na morze"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                {url && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={url}
                      alt="Podgląd"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={addPhoto.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" /> Dodaj zdjęcie
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Zdjęcie galerii"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                    {photo.caption && (
                      <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded truncate max-w-[70%]">
                        {photo.caption}
                      </span>
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="shrink-0 h-8 w-8 ml-auto"
                      onClick={() => handleDelete(photo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl gap-3">
              <ImageIcon className="w-12 h-12 opacity-30" />
              <p>Galeria jest pusta. Dodaj pierwsze zdjęcie!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
