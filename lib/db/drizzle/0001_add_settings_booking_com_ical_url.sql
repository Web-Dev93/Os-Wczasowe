-- Add booking_com_ical_url column to existing settings table.
-- Safe for existing databases (IF NOT EXISTS is idempotent).
-- Fresh databases created via 0000_normal_fenris.sql already include this column.
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "booking_com_ical_url" text;
