import { pool } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";

// Ensure the express-session table exists (connect-pg-simple's own
// createTableIfMissing cannot read its table.sql from the bundled build).
// Also: drizzle push can drop this table since it's not in the ORM schema.
const SESSION_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
`;

await pool.query(SESSION_TABLE_DDL).catch((err: unknown) => {
  logger.error({ err }, "Failed to ensure session table exists");
  process.exit(1);
});

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
