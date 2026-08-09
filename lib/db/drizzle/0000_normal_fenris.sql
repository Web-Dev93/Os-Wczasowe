CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"resort_name" text DEFAULT 'Ośrodek Nadmorski' NOT NULL,
	"tagline" text,
	"description" text,
	"address" text,
	"phone" text,
	"email" text,
	"website" text,
	"whatsapp" text,
	"facebook" text,
	"logo_url" text,
	"hero_image_url" text,
	"theme" text DEFAULT 'professional' NOT NULL,
	"booking_mode" text DEFAULT 'both' NOT NULL,
	"check_in_time" text DEFAULT '14:00',
	"check_out_time" text DEFAULT '10:00',
	"admin_password" text DEFAULT 'admin123' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"capacity" integer DEFAULT 2 NOT NULL,
	"price_per_night" real DEFAULT 0 NOT NULL,
	"min_nights" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"cover_photo_url" text,
	"amenities" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"guest_phone" text NOT NULL,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"guests_count" integer DEFAULT 1 NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"type" text DEFAULT 'inquiry' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"date_from" date NOT NULL,
	"date_to" date NOT NULL,
	"status" text DEFAULT 'blocked' NOT NULL,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "room_photos" ADD CONSTRAINT "room_photos_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;