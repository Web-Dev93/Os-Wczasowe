import React, { useEffect, useState } from "react";
import {
  useAdminGetSettings,
  useAdminUpdateSettings,
  getAdminGetSettingsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Palette, Phone, Lock, Image, Clock, CalendarArrowDown, ExternalLink, RefreshCw, BarChart3, MapPin, Calendar } from "lucide-react";
import { AdminTip } from "@/components/ui/admin-help";
import { ThemePicker } from "@/components/ui/theme-picker";

const THEMES = [
  { value: "professional", label: "Professional — Morski profesjonalizm" },
  { value: "exclusive", label: "Exclusive — Luksusowy i elegancki" },
  { value: "fun", label: "Fun — Wakacyjny i wesoły" },
  { value: "family", label: "Family — Przyjazny rodzinom" },
  { value: "rustic", label: "Rustic — Naturalny i przytulny" },
  { value: "modern", label: "Modern — Nowoczesny minimalizm" },
];

const BOOKING_MODES = [
  { value: "inquiry", label: "Tylko zapytania (formularz kontaktowy)" },
  { value: "online", label: "Tylko rezerwacje online" },
  { value: "both", label: "Oba — zapytania i rezerwacje online" },
];

type FieldGroupProps = { title: string; icon: React.ReactNode; children: React.ReactNode };
function FieldGroup({ title, icon, children }: FieldGroupProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const { data: settings, isLoading } = useAdminGetSettings();
  const updateSettings = useAdminUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({
    resortName: "",
    tagline: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
    facebook: "",
    logoUrl: "",
    heroImageUrl: "",
    heroImageUrl2: "",
    heroImageUrl3: "",
    theme: "professional",
    bookingMode: "both",
    checkInTime: "14:00",
    checkOutTime: "10:00",
    adminPassword: "",
    bookingComIcalUrl: "",
    googleCalendarUrl: "",
    googleAnalyticsId: "",
    googleMapsUrl: "",
  });
  const [icalImportStatus, setIcalImportStatus] = useState<{
    loading: boolean;
    result: { eventsFound: number } | null;
    error: string | null;
  }>({ loading: false, result: null, error: null });

  useEffect(() => {
    if (settings) {
      setForm({
        resortName: settings.resortName || "",
        tagline: settings.tagline || "",
        description: settings.description || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        website: settings.website || "",
        whatsapp: settings.whatsapp || "",
        facebook: settings.facebook || "",
        logoUrl: settings.logoUrl || "",
        heroImageUrl: settings.heroImageUrl || "",
        heroImageUrl2: settings.heroImageUrl2 || "",
        heroImageUrl3: settings.heroImageUrl3 || "",
        theme: settings.theme || "professional",
        bookingMode: settings.bookingMode || "both",
        checkInTime: settings.checkInTime || "14:00",
        checkOutTime: settings.checkOutTime || "10:00",
        adminPassword: "",
        bookingComIcalUrl: settings.bookingComIcalUrl || "",
        googleCalendarUrl: settings.googleCalendarUrl || "",
        googleAnalyticsId: settings.googleAnalyticsId || "",
        googleMapsUrl: settings.googleMapsUrl || "",
      });
    }
  }, [settings]);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSelect = (key: keyof typeof form) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resortName.trim()) {
      toast({ title: "Nazwa ośrodka jest wymagana", variant: "destructive" });
      return;
    }

    const payload: Record<string, string | undefined> = {
      resortName: form.resortName,
      tagline: form.tagline || undefined,
      description: form.description || undefined,
      address: form.address || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
      whatsapp: form.whatsapp || undefined,
      facebook: form.facebook || undefined,
      logoUrl: form.logoUrl || undefined,
      heroImageUrl: form.heroImageUrl || undefined,
      heroImageUrl2: form.heroImageUrl2 || undefined,
      heroImageUrl3: form.heroImageUrl3 || undefined,
      theme: form.theme,
      bookingMode: form.bookingMode,
      checkInTime: form.checkInTime || undefined,
      checkOutTime: form.checkOutTime || undefined,
      bookingComIcalUrl: form.bookingComIcalUrl || undefined,
      googleCalendarUrl: form.googleCalendarUrl || undefined,
      googleAnalyticsId: form.googleAnalyticsId || undefined,
      googleMapsUrl: form.googleMapsUrl || undefined,
    };

    if (form.adminPassword.trim()) {
      payload.adminPassword = form.adminPassword;
    }

    updateSettings.mutate(
      { data: payload as never },
      {
        onSuccess: () => {
          toast({ title: "Ustawienia zapisane ✓" });
          queryClient.invalidateQueries({ queryKey: getAdminGetSettingsQueryKey() });
          setForm(prev => ({ ...prev, adminPassword: "" }));
        },
        onError: () => toast({ title: "Błąd podczas zapisywania", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Ustawienia</h1>
          <p className="text-muted-foreground mt-1">Konfiguracja strony i ośrodka</p>
        </div>
        <Button type="submit" size="lg" disabled={updateSettings.isPending} className="gap-2">
          <Save className="w-4 h-4" />
          {updateSettings.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </div>

      <FieldGroup title="Podstawowe informacje" icon={<Globe className="w-5 h-5 text-primary" />}>
        <AdminTip text="Te informacje pojawiają się na stronie głównej Twojego ośrodka — w nagłówku, stopce i w wynikach wyszukiwania. Wypełnij je dokładnie, żeby goście wiedzieli, gdzie trafiają." />
        <Field label="Nazwa ośrodka" required>
          <Input value={form.resortName} onChange={handleChange("resortName")} placeholder="Ośrodek Przy Morzu" required />
        </Field>
        <Field label="Hasło / slogan">
          <Input value={form.tagline} onChange={handleChange("tagline")} placeholder="Twój wypoczynek nad Bałtykiem" />
          <AdminTip text="Krótkie zdanie widoczne w głównym banerze strony. Np. 'Twój wypoczynek nad Bałtykiem'." />
        </Field>
        <Field label="Opis ośrodka">
          <Textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Krótki opis widoczny na stronie głównej..."
            rows={4}
          />
          <AdminTip text="2–4 zdania zachęcające do rezerwacji. Pojawia się pod sloganem w banerze głównym." />
        </Field>
      </FieldGroup>

      <FieldGroup title="Kontakt" icon={<Phone className="w-5 h-5 text-primary" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Telefon">
            <Input value={form.phone} onChange={handleChange("phone")} placeholder="+48 500 123 456" />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={form.email} onChange={handleChange("email")} placeholder="kontakt@ośrodek.pl" />
          </Field>
        </div>
        <Field label="Adres">
          <Input value={form.address} onChange={handleChange("address")} placeholder="ul. Nadmorska 42, 84-100 Puck" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Facebook (URL)">
            <Input value={form.facebook} onChange={handleChange("facebook")} placeholder="https://facebook.com/mojosrodek" />
          </Field>
          <Field label="Strona WWW (URL)">
            <Input value={form.website} onChange={handleChange("website")} placeholder="https://mojosrodek.pl" />
          </Field>
        </div>
        <Field label="WhatsApp (numer telefonu)">
          <Input value={form.whatsapp} onChange={handleChange("whatsapp")} placeholder="+48 500 123 456" />
          <p className="text-xs text-muted-foreground pt-1">Numer w formacie międzynarodowym — pojawi się jako przycisk WhatsApp na stronie.</p>
        </Field>
      </FieldGroup>

      <FieldGroup title="Wygląd i zdjęcia" icon={<Image className="w-5 h-5 text-primary" />}>
        <AdminTip text="Zdjęcia slidera to pierwsze co widzi gość wchodząc na Twoją stronę. Użyj własnych zdjęć ośrodka — skopiuj link do zdjęcia (URL) i wklej poniżej. Jeśli nie masz własnych, możesz użyć darmowych zdjęć z unsplash.com." />
        <Field label="URL logo (opcjonalnie)">
          <Input value={form.logoUrl} onChange={handleChange("logoUrl")} placeholder="https://..." />
          <AdminTip text="Link do pliku z logo Twojego ośrodka. Jeśli zostawisz puste, w menu pojawi się sama nazwa ośrodka." />
          {form.logoUrl && (
            <img src={form.logoUrl} alt="Logo" className="mt-2 h-12 object-contain rounded border p-1 bg-muted" />
          )}
        </Field>
        <p className="text-xs text-muted-foreground -mt-2">Wklej URL zdjęcia (np. z Unsplash, Google Drive, własnego serwera). Slider pokazuje do 3 slajdów — zostaw puste żeby użyć domyślnego zdjęcia morskiego.</p>
        {[
          { key: "heroImageUrl" as const, label: "Slajd 1 — URL zdjęcia (główny baner)" },
          { key: "heroImageUrl2" as const, label: "Slajd 2 — URL zdjęcia" },
          { key: "heroImageUrl3" as const, label: "Slajd 3 — URL zdjęcia" },
        ].map(({ key, label }) => (
          <Field key={key} label={label}>
            <Input value={form[key]} onChange={handleChange(key)} placeholder="https://images.unsplash.com/..." />
            {form[key] && (
              <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
                <img src={form[key]} alt={label} className="w-full h-full object-cover" />
              </div>
            )}
          </Field>
        ))}
      </FieldGroup>

      <FieldGroup title="Wygląd strony" icon={<Palette className="w-5 h-5 text-primary" />}>
        <AdminTip text="Motyw zmienia kolory, czcionki i ogólny styl całej strony — zarówno publicznej jak i tego panelu. Kliknij kartę, żeby wybrać. Zmiana jest widoczna od razu po zapisaniu ustawień." />
        <Field label="Motyw kolorystyczny">
          <ThemePicker value={form.theme} onChange={(v) => setForm(prev => ({ ...prev, theme: v }))} />
        </Field>
        <Field label="Tryb rezerwacji">
          <Select value={form.bookingMode} onValueChange={handleSelect("bookingMode")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_MODES.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup title="Godziny" icon={<Clock className="w-5 h-5 text-primary" />}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Check-in">
            <Input type="time" value={form.checkInTime} onChange={handleChange("checkInTime")} />
          </Field>
          <Field label="Check-out">
            <Input type="time" value={form.checkOutTime} onChange={handleChange("checkOutTime")} />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup title="Synchronizacja z Booking.com (iCal)" icon={<CalendarArrowDown className="w-5 h-5 text-primary" />}>
        <Field label="URL kalendarza iCal z Booking.com">
          <Input
            value={form.bookingComIcalUrl}
            onChange={handleChange("bookingComIcalUrl")}
            placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?..."
          />
          <p className="text-xs text-muted-foreground pt-1">
            W panelu Booking.com: Nieruchomość → Kalendarze → Synchronizacja kalendarza → Skopiuj URL iCal.
          </p>
        </Field>

        <div className="flex flex-wrap gap-3 items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={icalImportStatus.loading}
            className="gap-2"
            onClick={async () => {
              setIcalImportStatus({ loading: true, result: null, error: null });
              try {
                const res = await fetch("/api/admin/ical-import", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url: form.bookingComIcalUrl || undefined }),
                  credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
                setIcalImportStatus({ loading: false, result: data, error: null });
                toast({ title: `Znaleziono ${data.eventsFound} wpisów w kalendarzu Booking.com` });
              } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                setIcalImportStatus({ loading: false, result: null, error: msg });
              }
            }}
          >
            {icalImportStatus.loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sprawdź kalendarz Booking.com
          </Button>

          <a
            href="/api/ical"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Pobierz eksport iCal (do importu w Booking.com)
          </a>
        </div>

        {icalImportStatus.error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            {icalImportStatus.error}
          </p>
        )}
        {icalImportStatus.result && (
          <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            ✓ Pobrano kalendarz — znaleziono {icalImportStatus.result.eventsFound} zajętych terminów.
          </p>
        )}
      </FieldGroup>

      <FieldGroup title="Integracje Google" icon={<Globe className="w-5 h-5 text-primary" />}>

        {/* ── Google Maps ───────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#34a853]" />
            <span className="font-semibold text-sm">Mapa Google Maps na stronie</span>
          </div>

          {/* Auto-map info box */}
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 leading-relaxed">
            <p className="font-semibold mb-1">✅ Mapa działa automatycznie!</p>
            <p>
              Wystarczy że masz wypełnione pole <strong>Adres</strong> w sekcji Kontakt powyżej —
              mapa pojawi się na stronie kontaktu i na stronie głównej bez żadnej dodatkowej konfiguracji.
            </p>
          </div>

          {/* Optional custom URL */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              📍 <strong>Opcjonalnie</strong> — chcesz wskazać dokładne miejsce na mapie?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jeśli Twój adres nie pokazuje dokładnego miejsca, możesz wkleić precyzyjny link do mapy.
              Poniżej znajdziesz jak to zrobić krok po kroku.
            </p>

            <div className="bg-background rounded-lg border border-border p-3 text-xs leading-loose text-foreground/80 space-y-0.5">
              <p className="font-semibold text-foreground mb-1">Jak zdobyć link do mapy (2 minuty):</p>
              <p>1️⃣ Otwórz <strong>maps.google.com</strong> w przeglądarce</p>
              <p>2️⃣ Znajdź swój ośrodek na mapie (wpisz adres w wyszukiwarce)</p>
              <p>3️⃣ Kliknij przycisk <strong>„Udostępnij"</strong> (ikona strzałki ↗)</p>
              <p>4️⃣ Wybierz zakładkę <strong>„Umieść mapę"</strong> (Embed a map)</p>
              <p>5️⃣ Kliknij <strong>„Kopiuj HTML"</strong></p>
              <p>6️⃣ Wklej skopiowany kod do pola poniżej — my automatycznie wyciągniemy z niego link</p>
            </div>

            <Field label="">
              <Input
                value={form.googleMapsUrl}
                onChange={(e) => {
                  // Accept both full iframe HTML and raw src URL
                  let val = e.target.value;
                  const srcMatch = val.match(/src="([^"]+)"/);
                  if (srcMatch) val = srcMatch[1];
                  setForm(prev => ({ ...prev, googleMapsUrl: val }));
                }}
                placeholder='Wklej link do mapy lub cały kod <iframe src="...">'
                className="font-mono text-xs"
              />
              {form.googleMapsUrl && (
                <p className="text-xs text-green-700 pt-1">✓ Link do mapy zapisany — pojawi się na stronie po zapisaniu ustawień</p>
              )}
              {!form.googleMapsUrl && (
                <p className="text-xs text-muted-foreground pt-1">
                  Zostaw puste — mapa i tak pojawi się automatycznie z Twojego adresu.
                </p>
              )}
            </Field>
          </div>
        </div>

        <div className="border-t border-border my-2" />

        {/* ── Google Calendar ───────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1a73e8]" />
            <span className="font-semibold text-sm">Google Calendar — synchronizacja terminów</span>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jeśli prowadzisz kalendarz rezerwacji w Google Calendar, wklej jego adres poniżej —
              zajęte dni automatycznie zablokują się na Twojej stronie.
            </p>
            <div className="bg-background rounded-lg border border-border p-3 text-xs leading-loose text-foreground/80 space-y-0.5">
              <p className="font-semibold text-foreground mb-1">Jak zdobyć adres kalendarza:</p>
              <p>1️⃣ Otwórz <strong>calendar.google.com</strong></p>
              <p>2️⃣ Po lewej kliknij ⋮ przy swoim kalendarzu → <strong>„Ustawienia i udostępnianie"</strong></p>
              <p>3️⃣ Przewiń do sekcji <strong>„Integracja kalendarza"</strong></p>
              <p>4️⃣ Skopiuj <strong>„Tajny adres w formacie iCal"</strong> (długi link)</p>
              <p>5️⃣ Wklej go poniżej</p>
            </div>
            <Field label="">
              <Input
                value={form.googleCalendarUrl}
                onChange={handleChange("googleCalendarUrl")}
                placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                className="font-mono text-xs"
              />
              {form.googleCalendarUrl && (
                <p className="text-xs text-green-700 pt-1">✓ Kalendarz Google podłączony</p>
              )}
            </Field>
          </div>
        </div>

        <div className="border-t border-border my-2" />

        {/* ── Google Analytics ──────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#e37400]" />
            <span className="font-semibold text-sm">Google Analytics — statystyki odwiedzin</span>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chcesz wiedzieć ile osób odwiedza Twoją stronę, skąd przychodzą i co oglądają?
              Wklej swój identyfikator Google Analytics 4 poniżej.
            </p>
            <div className="bg-background rounded-lg border border-border p-3 text-xs leading-loose text-foreground/80 space-y-0.5">
              <p className="font-semibold text-foreground mb-1">Jak znaleźć identyfikator GA4:</p>
              <p>1️⃣ Wejdź na <strong>analytics.google.com</strong></p>
              <p>2️⃣ Kliknij ⚙️ <strong>„Admin"</strong> (lewy dolny róg)</p>
              <p>3️⃣ Kliknij <strong>„Strumienie danych"</strong> → wybierz swoją stronę</p>
              <p>4️⃣ Skopiuj <strong>„Identyfikator pomiaru"</strong> (zaczyna się od G-)</p>
            </div>
            <Field label="">
              <Input
                value={form.googleAnalyticsId}
                onChange={handleChange("googleAnalyticsId")}
                placeholder="G-XXXXXXXXXX"
                className="font-mono"
              />
              {form.googleAnalyticsId && (
                <p className="text-xs text-green-700 pt-1">✓ Google Analytics podłączone — ID: {form.googleAnalyticsId}</p>
              )}
            </Field>
          </div>
        </div>
      </FieldGroup>

      <FieldGroup title="Bezpieczeństwo" icon={<Lock className="w-5 h-5 text-primary" />}>
        <Field label="Nowe hasło administratora">
          <Input
            type="password"
            value={form.adminPassword}
            onChange={handleChange("adminPassword")}
            placeholder="Zostaw puste, żeby nie zmieniać"
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground pt-1">Wypełnij tylko jeśli chcesz zmienić hasło.</p>
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateSettings.isPending} className="gap-2">
          <Save className="w-4 h-4" />
          {updateSettings.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </div>
    </form>
  );
}
