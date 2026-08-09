import React from "react";
import { Link } from "wouter";
import { useAdminGetStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BedDouble, CalendarCheck, CalendarClock, Ban, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminGetStats();

  if (isLoading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-8 w-48 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
      </div>
    </div>;
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Przegląd sytuacji w ośrodku</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Aktywne pokoje</CardTitle>
            <BedDouble className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRooms} / {stats.totalRooms}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Oczekujące rezerwacje</CardTitle>
            <CalendarClock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.pendingBookings}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Potwierdzone rezerwacje</CardTitle>
            <CalendarCheck className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Anulowane rezerwacje</CardTitle>
            <Ban className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelledBookings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ostatnie zapytania i rezerwacje</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/rezerwacje">Zobacz wszystkie</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map(booking => (
                  <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-muted/20">
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <p className="font-medium">{booking.guestName}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(booking.createdAt), "dd MMM yyyy", { locale: pl })}</span>
                        <span>{booking.roomName || "Dowolny pokój"}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkIn), "dd MMM")} - {format(new Date(booking.checkOut), "dd MMM")} ({booking.guestsCount} osób)
                      </div>
                    </div>
                    <div>
                      {booking.status === 'pending' && <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full"><CalendarClock className="w-3.5 h-3.5" /> Oczekuje</span>}
                      {booking.status === 'confirmed' && <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-100 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Potwierdzona</span>}
                      {booking.status === 'cancelled' && <span className="flex items-center gap-1.5 text-sm font-medium text-destructive bg-destructive/10 px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Anulowana</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Brak rezerwacji.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
