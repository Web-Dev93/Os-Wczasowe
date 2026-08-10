FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY artifacts/api-server/package.json artifacts/api-server/package.json
COPY artifacts/landing/package.json artifacts/landing/package.json
COPY artifacts/osrodek/package.json artifacts/osrodek/package.json
COPY artifacts/mockup-sandbox/package.json artifacts/mockup-sandbox/package.json
COPY scripts/package.json scripts/package.json
COPY lib/db/package.json lib/db/package.json
COPY lib/api-client-react/package.json lib/api-client-react/package.json
COPY lib/api-spec/package.json lib/api-spec/package.json
COPY lib/api-zod/package.json lib/api-zod/package.json
COPY lib/object-storage-web/package.json lib/object-storage-web/package.json
RUN pnpm install --no-frozen-lockfile

FROM deps AS build
COPY . .
COPY --from=deps /repo/node_modules ./node_modules
RUN pnpm install --no-frozen-lockfile --offline

ENV NODE_ENV=production
ENV PORT=5173
RUN BASE_PATH=/ pnpm --filter @workspace/landing run build
RUN BASE_PATH=/osrodek/ pnpm --filter @workspace/osrodek run build
RUN pnpm --filter @workspace/api-server run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV STATIC_ROOT=/app/static
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/artifacts/api-server/node_modules ./artifacts/api-server/node_modules
COPY --from=build /repo/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=build /repo/artifacts/landing/dist/public ./static/landing
COPY --from=build /repo/artifacts/osrodek/dist/public ./static/osrodek
EXPOSE 5000
CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
