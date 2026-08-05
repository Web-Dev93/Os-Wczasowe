import React, { useState } from "react";
import { 
  useAdminListAvailability, 
  useAdminCreateAvailability, 
  useAdminDeleteAvailability,
  useAdminListRooms,
  getAdminListAvailabilityQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarDays, Plus, Trash2 } from "lucide-react";

export default function AdminAvailability() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState<"blocked" | "booked">("blocked");
  const [note, setNote] = useState("");

  const { data: rooms } = useAdminListRooms();
  
  const queryParams = selectedRoomId !== "all" ? { roomId: parseInt(selectedRoomId, 10) } : undefined;
  
  const { data: blocks, isLoading } = useAdminListAvailability(queryParams, {
    query: {
      queryKey: getAdminListAvailabilityQueryKey(queryParams)
    }
  });

  const createBlock = useAdminCreateAvailability();
  const deleteBlock = useAdminDeleteAvailability();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoomId === "all") {
      toast({ title: "Wybierz pokój", variant: "destructive" });
      return;
    }
    if (!dateFrom || !dateTo) {
      toast({ title: "Wybierz daty", variant: "destructive" });
      return;
    }

    createBlock.mutate({
      data: {
        roomId: parseInt(selectedRoomId, 10),
        dateFrom,
        dateTo,
        status,
        note: note || undefined
      }
    }, {
      onSuccess: () => {
        toast({ title: "Termin zablokowany" });
        queryClient.invalidateQueries({ queryKey: getAdminListAvailabilityQueryKey(queryParams) });
        setDateFrom("");
        setDateTo("");
        setNote("");
      },
      onError: () => toast({ title: "Błąd podczas zapisywania", variant: "destructive" })
    });
  };

  const handleDelete = (id: number) => {
    deleteBlock.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Blokada usunięta" });
        queryClient.invalidateQueries({ queryKey: getAdminListAvailabilityQueryKey(queryParams) });
      },
      onError: () => toast({ title: "Błąd usuwania", variant: "destructive" })
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Dostępność</h1>
        <p className="text-muted-foreground mt-1">Zarządzaj zablokowanymi terminami dla pokoi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Block Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Zablokuj termin</h3>
              <form onSubmit={handleAddBlock} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pokój</label>
                  <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz pokój" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie (tylko widok)</SelectItem>
                      {rooms?.map(room => (
                        <SelectItem key={room.id} value={room.id.toString()}>{room.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Od</label>
                    <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Do</label>
                    <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} min={dateFrom} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Typ blokady</label>
                  <Select value={status} onValueChange={(v: "blocked" | "booked") => setStatus(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blocked">Niedostępne (Zablokowane)</SelectItem>
                      <SelectItem value="booked">Zarezerwowane (Poza systemem)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notatka (opcjonalnie)</label>
                  <Input placeholder="Np. Remont, Rodzina" value={note} onChange={e => setNote(e.target.value)} />
                </div>

                <Button type="submit" className="w-full" disabled={createBlock.isPending || selectedRoomId === "all"}>
                  <Plus className="w-4 h-4 mr-2" /> Dodaj
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List of blocks */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0">
              <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                <h3 className="font-bold">Zablokowane terminy</h3>
                {selectedRoomId !== "all" && (
                  <span className="text-sm text-primary font-medium">
                    Wybrany pokój: {rooms?.find(r => r.id.toString() === selectedRoomId)?.name}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                {isLoading ? (
                  <div>Ładowanie...</div>
                ) : blocks && blocks.length > 0 ? (
                  <div className="space-y-3">
                    {blocks.map(block => {
                      const room = rooms?.find(r => r.id === block.roomId);
                      return (
                        <div key={block.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${block.status === 'blocked' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                              <CalendarDays className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {format(new Date(block.dateFrom), "dd MMM yyyy", { locale: pl })} - {format(new Date(block.dateTo), "dd MMM yyyy", { locale: pl })}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{room?.name || `Pokój #${block.roomId}`}</span>
                                {block.note && <span>&middot; {block.note}</span>}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 shrink-0" onClick={() => handleDelete(block.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Brak zablokowanych terminów.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
