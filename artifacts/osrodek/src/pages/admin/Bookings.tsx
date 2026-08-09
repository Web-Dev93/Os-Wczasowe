import React from "react";
import { 
  useAdminListBookings, 
  useAdminUpdateBooking, 
  useAdminDeleteBooking,
  getAdminListBookingsQueryKey,
  BookingStatus
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  CalendarClock, CheckCircle2, XCircle, Trash2, Check, X,
  MessageSquare, User, Phone, Mail, Calendar, Search
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminBookings() {
  const { data: bookings, isLoading } = useAdminListBookings();
  const updateBooking = useAdminUpdateBooking();
  const deleteBooking = useAdminDeleteBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: typeof BookingStatus[keyof typeof BookingStatus]) => {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Status zaktualizowany" });
        queryClient.invalidateQueries({ queryKey: getAdminListBookingsQueryKey() });
      },
      onError: () => toast({ title: "Błąd aktualizacji", variant: "destructive" })
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tę rezerwację/zapytanie?")) return;
    deleteBooking.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Usunięto" });
        queryClient.invalidateQueries({ queryKey: getAdminListBookingsQueryKey() });
      },
      onError: () => toast({ title: "Błąd podczas usuwania", variant: "destructive" })
    });
  };

  if (isLoading) return <div>Ładowanie...</div>;

  const pending = bookings?.filter(b => b.status === 'pending') || [];
  const confirmed = bookings?.filter(b => b.status === 'confirmed') || [];
  const cancelled = bookings?.filter(b => b.status === 'cancelled') || [];

  const BookingList = ({ list }: { list: typeof bookings }) => {
    if (!list || list.length === 0) {
      return <div className="py-12 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
        Brak rezerwacji w tej kategorii.
      </div>;
    }

    return (
      <div className="space-y-4">
        {list.map(booking => (
          <Card key={booking.id} className="overflow-hidden">
            <div className={`h-1.5 w-full ${
              booking.status === 'pending' ? 'bg-amber-500' : 
              booking.status === 'confirmed' ? 'bg-green-500' : 'bg-destructive'
            }`} />
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 justify-between">
                
                {/* Guest Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-lg">{booking.guestName}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted ml-2 uppercase">
                      {booking.type === 'booking' ? 'Rezerwacja' : 'Zapytanie'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    <a href={`mailto:${booking.guestEmail}`} className="flex items-center gap-1.5 hover:text-primary"><Mail className="w-4 h-4" /> {booking.guestEmail}</a>
                    <a href={`tel:${booking.guestPhone}`} className="flex items-center gap-1.5 hover:text-primary"><Phone className="w-4 h-4" /> {booking.guestPhone}</a>
                  </div>
                  {booking.message && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="italic text-muted-foreground leading-relaxed">{booking.message}</p>
                    </div>
                  )}
                </div>

                {/* Stay Info */}
                <div className="space-y-3 flex-1 lg:max-w-xs bg-muted/20 p-4 rounded-xl">
                  <div className="font-medium text-foreground">{booking.roomName || "Dowolny pokój"}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(booking.checkIn), "dd MMM yyyy", { locale: pl })} - {format(new Date(booking.checkOut), "dd MMM yyyy", { locale: pl })}
                  </div>
                  <div className="text-sm">
                    <strong>Dorośli:</strong> {booking.guestsCount}
                    {typeof (booking as { childrenCount?: number }).childrenCount === "number" && ((booking as { childrenCount?: number }).childrenCount ?? 0) > 0 && (
                      <> · <strong>Dzieci:</strong> {(booking as { childrenCount?: number }).childrenCount}</>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                    Otrzymano: {format(new Date(booking.createdAt), "dd MMM HH:mm")}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 justify-end lg:w-40 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 border-border/50">
                  {booking.status !== 'confirmed' && (
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                      <Check className="w-4 h-4 mr-2" /> Potwierdź
                    </Button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <Button size="sm" variant="outline" className="w-full text-destructive hover:bg-destructive/10" onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                      <X className="w-4 h-4 mr-2" /> Odrzuć
                    </Button>
                  )}
                  {booking.status !== 'pending' && (
                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleStatusChange(booking.id, 'pending')}>
                      <CalendarClock className="w-4 h-4 mr-2" /> Przywróć
                    </Button>
                  )}
                  <div className="flex-1 lg:flex-none"></div>
                  <Button size="sm" variant="ghost" className="w-full text-muted-foreground hover:text-destructive" onClick={() => handleDelete(booking.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Usuń
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Rezerwacje</h1>
        <p className="text-muted-foreground mt-1">Zarządzaj zapytaniami i potwierdzonymi rezerwacjami</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
          <TabsTrigger value="pending" className="flex gap-2 text-base">
            Oczekujące {pending.length > 0 && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{pending.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex gap-2 text-base">
            Potwierdzone {confirmed.length > 0 && <span className="bg-muted-foreground text-background text-xs px-2 py-0.5 rounded-full">{confirmed.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex gap-2 text-base">
            Anulowane
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><BookingList list={pending} /></TabsContent>
        <TabsContent value="confirmed"><BookingList list={confirmed} /></TabsContent>
        <TabsContent value="cancelled"><BookingList list={cancelled} /></TabsContent>
      </Tabs>
    </div>
  );
}
