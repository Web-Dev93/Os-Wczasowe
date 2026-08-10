/**
 * Demo seed – wypełnia bazę przykładowymi danymi ośrodka nadmorskiego.
 * Uruchom: pnpm --filter @workspace/api-server run seed
 */

import { db, pool, roomsTable, roomPhotosTable, galleryPhotosTable, bookingsTable, availabilityTable, postsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🌊 Seedowanie bazy demo…");

  // Wyczyść istniejące dane (kolejność: FK-safe)
  await db.delete(availabilityTable);
  await db.delete(bookingsTable);
  await db.delete(postsTable);
  await db.delete(roomPhotosTable);
  await db.delete(galleryPhotosTable);
  await db.delete(roomsTable);
  await db.execute(sql`ALTER SEQUENCE rooms_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE gallery_photos_id_seq RESTART WITH 1`);

  console.log("  🗑️  Wyczyszczono stare dane");

  // ── POKOJE ─────────────────────────────────────────────────────────────────

  const rooms = await db
    .insert(roomsTable)
    .values([
      {
        name: "Apartament Morski",
        description:
          "Przestronny apartament z widokiem na morze. Posiada oddzielną sypialnię, salon z rozkładaną sofą oraz pełnowymiarową kuchnię. Balkon skierowany na wschód – idealne miejsce do porannej kawy z widokiem na wschód słońca nad Bałtykiem.",
        capacity: 4,
        pricePerNight: 420,
        minNights: 2,
        isActive: true,
        sortOrder: 1,
        coverPhotoUrl:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        amenities: [
          "Widok na morze",
          "Balkon",
          "Aneks kuchenny",
          "Wi-Fi",
          "TV",
          "Klimatyzacja",
        ],
      },
      {
        name: "Pokój Plażowy",
        description:
          "Przytulny pokój dwuosobowy z bezpośrednim wyjściem na plażę. Wyposażony w łazienkę z prysznicem oraz duże okna zapewniające naturalne światło. Idealne dla par szukających romantycznego wypoczynku tuż przy Bałtyku.",
        capacity: 2,
        pricePerNight: 260,
        minNights: 2,
        isActive: true,
        sortOrder: 2,
        coverPhotoUrl:
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
        amenities: [
          "Wyjście na plażę",
          "Łazienka z prysznicem",
          "Wi-Fi",
          "TV",
          "Minibar",
        ],
      },
      {
        name: "Studio Słoneczne",
        description:
          "Nowoczesne studio z aneksem kuchennym, doskonałe dla rodzin z dziećmi lub małych grup. Jasne i słoneczne wnętrze z widokiem na ogród. Zaledwie 200 metrów od plaży.",
        capacity: 3,
        pricePerNight: 320,
        minNights: 3,
        isActive: true,
        sortOrder: 3,
        coverPhotoUrl:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        amenities: [
          "Aneks kuchenny",
          "Ogród",
          "Wi-Fi",
          "TV",
          "Parking",
          "Stół do gier",
        ],
      },
      {
        name: "Pokój Rodzinny",
        description:
          "Duży pokój rodzinny z dwiema sypialniami, idealny dla rodzin z dziećmi. Wyposażony w łóżko małżeńskie i dwa łóżka pojedyncze. Przestronna łazienka z wanną. Taras z meblami ogrodowymi.",
        capacity: 5,
        pricePerNight: 480,
        minNights: 3,
        isActive: true,
        sortOrder: 4,
        coverPhotoUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        amenities: [
          "Dwie sypialnie",
          "Taras",
          "Łazienka z wanną",
          "Wi-Fi",
          "TV",
          "Parking",
          "Sprzęt plażowy",
        ],
      },
      {
        name: "Penthouse Bałtyk",
        description:
          "Ekskluzywny penthouse na najwyższym piętrze z panoramicznym widokiem na Morze Bałtyckie. Dwie sypialnie, otwarta kuchnia, luksusowa łazienka z jacuzzi i przestronny taras. Dla gości, którzy oczekują czegoś wyjątkowego.",
        capacity: 4,
        pricePerNight: 780,
        minNights: 3,
        isActive: true,
        sortOrder: 5,
        coverPhotoUrl:
          "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&q=80",
        amenities: [
          "Panoramiczny widok",
          "Jacuzzi",
          "Dwie sypialnie",
          "Taras",
          "Kuchnia",
          "Wi-Fi",
          "TV",
          "Klimatyzacja",
          "Concierge",
        ],
      },
    ])
    .returning();

  console.log(`  🛏️  Dodano ${rooms.length} pokoi`);

  // ── ZDJĘCIA POKOI ──────────────────────────────────────────────────────────

  const [morski, plazowy, studio, rodzinny, penthouse] = rooms;

  await db.insert(roomPhotosTable).values([
    // Apartament Morski
    { roomId: morski.id, url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80", caption: "Widok na morze z balkonu", sortOrder: 0 },
    { roomId: morski.id, url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80", caption: "Salon z wygodną sofą", sortOrder: 1 },
    { roomId: morski.id, url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80", caption: "Elegancka sypialnia", sortOrder: 2 },
    // Pokój Plażowy
    { roomId: plazowy.id, url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80", caption: "Przytulne wnętrze", sortOrder: 0 },
    { roomId: plazowy.id, url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80", caption: "Wyjście na plażę", sortOrder: 1 },
    // Studio Słoneczne
    { roomId: studio.id, url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80", caption: "Jasne studio", sortOrder: 0 },
    { roomId: studio.id, url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80", caption: "Aneks kuchenny", sortOrder: 1 },
    // Pokój Rodzinny
    { roomId: rodzinny.id, url: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80", caption: "Taras z widokiem", sortOrder: 0 },
    { roomId: rodzinny.id, url: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80", caption: "Sypialnia dla dzieci", sortOrder: 1 },
    // Penthouse
    { roomId: penthouse.id, url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80", caption: "Panoramiczny widok", sortOrder: 0 },
    { roomId: penthouse.id, url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80", caption: "Taras penthouse", sortOrder: 1 },
    { roomId: penthouse.id, url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80", caption: "Luksusowe jacuzzi", sortOrder: 2 },
  ]);

  console.log("  📸 Dodano zdjęcia pokoi");

  // ── GALERIA ─────────────────────────────────────────────────────────────────

  await db.insert(galleryPhotosTable).values([
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", caption: "Plaża o wschodzie słońca", sortOrder: 0 },
    { url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80", caption: "Słoneczny dzień na Bałtyku", sortOrder: 1 },
    { url: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80", caption: "Klify nad morzem", sortOrder: 2 },
    { url: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1200&q=80", caption: "Zachód słońca nad Bałtykiem", sortOrder: 3 },
    { url: "https://images.unsplash.com/photo-1534008757030-27299c4371b6?w=1200&q=80", caption: "Spokojna plaża", sortOrder: 4 },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80", caption: "Molo o zmierzchu", sortOrder: 5 },
    { url: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=1200&q=80", caption: "Falochron i morze", sortOrder: 6 },
    { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", caption: "Plaża po letniej burzy", sortOrder: 7 },
    { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80", caption: "Ośrodek od strony ogrodu", sortOrder: 8 },
  ]);

  console.log("  🖼️  Dodano 9 zdjęć galerii");

  // ── REZERWACJE PRZYKŁADOWE ──────────────────────────────────────────────────

  await db.insert(bookingsTable).values([
    {
      roomId: morski.id,
      guestName: "Anna Kowalska",
      guestEmail: "anna.kowalska@example.pl",
      guestPhone: "+48 600 123 456",
      checkIn: "2026-08-15",
      checkOut: "2026-08-22",
      guestsCount: 2,
      message: "Prosimy o pokój na wyższym piętrze z widokiem na morze.",
      status: "confirmed",
      type: "booking",
    },
    {
      roomId: rodzinny.id,
      guestName: "Piotr Nowak",
      guestEmail: "piotr.nowak@example.pl",
      guestPhone: "+48 501 987 654",
      checkIn: "2026-08-10",
      checkOut: "2026-08-17",
      guestsCount: 4,
      message: "Jedziemy z dwójką dzieci (6 i 9 lat). Czy jest możliwość dostawki?",
      status: "confirmed",
      type: "booking",
    },
    {
      roomId: penthouse.id,
      guestName: "Katarzyna Wiśniewska",
      guestEmail: "k.wisniewska@example.pl",
      guestPhone: "+48 730 456 789",
      checkIn: "2026-08-28",
      checkOut: "2026-09-04",
      guestsCount: 2,
      message: "Rezerwacja na rocznicę ślubu. Prosimy o przygotowanie niespodzianki 🙂",
      status: "pending",
      type: "booking",
    },
    {
      roomId: plazowy.id,
      guestName: "Marek Zieliński",
      guestEmail: "marek.z@example.pl",
      guestPhone: "+48 888 321 654",
      checkIn: "2026-09-05",
      checkOut: "2026-09-10",
      guestsCount: 2,
      message: null,
      status: "pending",
      type: "inquiry",
    },
    {
      roomId: studio.id,
      guestName: "Monika Lewandowska",
      guestEmail: "m.lewandowska@example.pl",
      guestPhone: "+48 512 654 321",
      checkIn: "2026-07-25",
      checkOut: "2026-08-01",
      guestsCount: 3,
      message: "Dziękuję za wspaniały pobyt! Wrócimy na pewno.",
      status: "confirmed",
      type: "booking",
      adminNotes: "Stali goście – 5% rabat przyznany",
    },
  ]);

  console.log("  📅 Dodano 5 przykładowych rezerwacji");

  // ── BLOKADY DOSTĘPNOŚCI ────────────────────────────────────────────────────

  await db.insert(availabilityTable).values([
    // Apartament Morski: zarezerwowany wg bookingu powyżej
    { roomId: morski.id, dateFrom: "2026-08-15", dateTo: "2026-08-22", status: "blocked", note: "Rezerwacja: Anna Kowalska" },
    // Pokój Rodzinny: zarezerwowany
    { roomId: rodzinny.id, dateFrom: "2026-08-10", dateTo: "2026-08-17", status: "blocked", note: "Rezerwacja: Piotr Nowak" },
    // Penthouse: oczekująca
    { roomId: penthouse.id, dateFrom: "2026-08-28", dateTo: "2026-09-04", status: "blocked", note: "Rezerwacja: Katarzyna Wiśniewska" },
    // Studio: miniony pobyt (historyczny)
    { roomId: studio.id, dateFrom: "2026-07-25", dateTo: "2026-08-01", status: "blocked", note: "Rezerwacja: Monika Lewandowska" },
    // Konserwacja
    { roomId: morski.id, dateFrom: "2026-09-01", dateTo: "2026-09-03", status: "blocked", note: "Przegląd techniczny klimatyzacji" },
  ]);

  console.log("  🔒 Dodano blokady dostępności");

  // ── AKTUALNOŚCI ─────────────────────────────────────────────────────────────

  await db.insert(postsTable).values([
    {
      title: "Sezon letni 2026 — rezerwacje otwarte!",
      content:
        "Ruszyły rezerwacje na sezon letni. Polecamy wczesną rezerwację — lipiec i sierpień zapełniają się najszybciej. Przy pobytach powyżej 7 nocy oferujemy 10% rabatu.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      isPublished: true,
    },
    {
      title: "Nowość: rowery dla gości bezpłatnie",
      content:
        "Od tego sezonu każdy gość może bezpłatnie wypożyczyć rower. Nadmorska ścieżka rowerowa zaczyna się 100 m od ośrodka — idealna na poranną przejażdżkę wzdłuż wybrzeża.",
      imageUrl: "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1200&q=80",
      isPublished: true,
    },
    {
      title: "Majówka nad morzem — zostały ostatnie pokoje",
      content:
        "Na długi weekend majowy zostały już tylko dwa wolne pokoje. Śniadania w cenie, a dla dzieci plac zabaw i sala gier. Zapraszamy do rezerwacji!",
      imageUrl: "https://images.unsplash.com/photo-1414073875831-b47709631146?w=1200&q=80",
      isPublished: true,
    },
  ]);

  console.log("  📰 Dodano 3 aktualności");

  console.log("\n✅ Seedowanie zakończone pomyślnie!");
  console.log("   5 pokoi | 12 zdjęć pokoi | 9 zdjęć galerii | 5 rezerwacji | 5 blokad | 3 aktualności");
}

main()
  .catch((err) => {
    console.error("❌ Błąd seedowania:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
