import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Behind a reverse proxy (Caddy) that terminates TLS, Express otherwise sees
// a plain HTTP connection and express-session refuses to set `secure` cookies.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      // Bundled build cannot read connect-pg-simple's table.sql (ENOENT poisons
      // the store and every session save fails). The "session" table is created
      // by scripts/ensure-session-table.sql / post-merge setup instead.
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET ?? "seaside-resort-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

app.use("/api", router);

// Self-hosted deployments (outside Replit's multi-artifact router) serve the
// built frontends directly from this process when STATIC_ROOT is set.
const staticRoot = process.env.STATIC_ROOT;

if (staticRoot) {
  const osrodekDir = path.join(staticRoot, "osrodek");
  const landingDir = path.join(staticRoot, "landing");

  app.use("/osrodek", express.static(osrodekDir));
  app.get(/^\/osrodek(\/.*)?$/, (_req, res) => {
    res.sendFile(path.join(osrodekDir, "index.html"));
  });

  app.use(express.static(landingDir));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(landingDir, "index.html"));
  });
}

export default app;
