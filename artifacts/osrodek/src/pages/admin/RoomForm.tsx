import React, { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useAdminGetRoom, 
  useAdminCreateRoom, 
  useAdminUpdateRoom,
  getAdminGetRoomQueryKey,
  getAdminListRoomsQueryKey
} from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";

const roomSchema = z.object({
  name: z.string().min(2, "Nazwa jest wymagana"),
  description: z.string().optional(),
  capacity: z.coerce.number().min(1, "Minimum 1 osoba"),
  pricePerNight: z.coerce.number().min(0, "Cena musi być dodatnia"),
  minNights: z.coerce.number().min(1, "Minimum 1 noc"),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  coverPhotoUrl: z.string().optional(),
  amenities: z.array(z.string()).default([]),
});

const AMENITIES_LIST = [
  "WiFi", "TV", "Klimatyzacja", "Łazienka", 
  "Prysznic", "Wanna", "Balkon", "Taras", 
  "Ogród", "Widok na morze", "Aneks kuchenny", 
  "Ekspres do kawy", "Lodówka", "Parking", "Grill"
];

export default function AdminRoomForm() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isNew = !params.id || params.id === "nowy";
  const roomId = isNew ? 0 : parseInt(params.id as string, 10);

  const { data: room, isLoading: isRoomLoading } = useAdminGetRoom(roomId, {
    query: {
      enabled: !isNew,
      queryKey: getAdminGetRoomQueryKey(roomId)
    }
  });

  const createRoom = useAdminCreateRoom();
  const updateRoom = useAdminUpdateRoom();

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 2,
      pricePerNight: 0,
      minNights: 1,
      isActive: true,
      sortOrder: 0,
      coverPhotoUrl: "",
      amenities: [],
    },
  });

  useEffect(() => {
    if (room && !isNew) {
      form.reset({
        name: room.name,
        description: room.description || "",
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        minNights: room.minNights || 1,
        isActive: room.isActive,
        sortOrder: room.sortOrder,
        coverPhotoUrl: room.coverPhotoUrl || "",
        amenities: room.amenities || [],
      });
    }
  }, [room, isNew, form]);

  const onSubmit = (values: z.infer<typeof roomSchema>) => {
    if (isNew) {
      createRoom.mutate({ data: values }, {
        onSuccess: () => {
          toast({ title: "Pokój dodany pomyślnie" });
          queryClient.invalidateQueries({ queryKey: getAdminListRoomsQueryKey() });
          setLocation("/admin/pokoje");
        },
        onError: () => toast({ title: "Błąd podczas dodawania", variant: "destructive" })
      });
    } else {
      updateRoom.mutate({ id: roomId, data: values }, {
        onSuccess: () => {
          toast({ title: "Pokój zaktualizowany" });
          queryClient.invalidateQueries({ queryKey: getAdminGetRoomQueryKey(roomId) });
          queryClient.invalidateQueries({ queryKey: getAdminListRoomsQueryKey() });
          setLocation("/admin/pokoje");
        },
        onError: () => toast({ title: "Błąd podczas aktualizacji", variant: "destructive" })
      });
    }
  };

  if (!isNew && isRoomLoading) return <div>Ładowanie...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">
              {isNew ? "Nowy pokój" : `Edycja pokoju: ${room?.name}`}
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nazwa pokoju</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cena za noc (zł)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pojemność (osoby)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minNights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimalna liczba nocy</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kolejność (sortowanie)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverPhotoUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>URL zdjęcia głównego (opcjonalnie)</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Opis pokoju</FormLabel>
                    <FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Aktywny</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Czy pokój ma być widoczny na stronie publicznej?
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Udogodnienia</h3>
              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                      {AMENITIES_LIST.map((amenity) => (
                        <FormField
                          key={amenity}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem key={amenity} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, amenity])
                                        : field.onChange(field.value?.filter((value) => value !== amenity));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm">
                                  {amenity}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={createRoom.isPending || updateRoom.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isNew ? "Dodaj pokój" : "Zapisz zmiany"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
