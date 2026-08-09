import React from "react";
import { Link } from "wouter";
import { useAdminListRooms, useAdminDeleteRoom, getAdminListRoomsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Edit, Trash2, Plus, EyeOff, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminRooms() {
  const { data: rooms, isLoading } = useAdminListRooms();
  const deleteRoom = useAdminDeleteRoom();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć ten pokój?")) return;

    deleteRoom.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Pokój usunięty" });
        queryClient.invalidateQueries({ queryKey: getAdminListRoomsQueryKey() });
      },
      onError: () => {
        toast({ title: "Błąd podczas usuwania", variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div>Ładowanie...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Pokoje</h1>
          <p className="text-muted-foreground mt-1">Zarządzaj pokojami i apartamentami</p>
        </div>
        <Button asChild>
          <Link href="/pokoje/nowy">
            <Plus className="w-4 h-4 mr-2" /> Dodaj pokój
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms?.map(room => (
          <Card key={room.id} className={!room.isActive ? "opacity-70" : ""}>
            <div className="aspect-[16/9] relative overflow-hidden rounded-t-xl bg-muted">
              {room.coverPhotoUrl ? (
                <img src={room.coverPhotoUrl} alt={room.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Brak zdjęcia
                </div>
              )}
              {!room.isActive && (
                <div className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Ukryty
                </div>
              )}
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight">{room.name}</h3>
                <span className="font-bold text-primary">{room.pricePerNight} zł</span>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                Max. {room.capacity} osób &middot; {room.minNights ? `Min. ${room.minNights} nocy` : 'Brak min. nocy'}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/pokoje/${room.id}/edytuj`}>
                    <Edit className="w-4 h-4 mr-2" /> Edytuj
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive shrink-0" onClick={() => handleDelete(room.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!rooms || rooms.length === 0) && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            Nie masz jeszcze żadnych pokoi. Dodaj pierwszy!
          </div>
        )}
      </div>
    </div>
  );
}
