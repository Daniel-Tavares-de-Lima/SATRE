# SATRE API — production image (Railway / Render / Docker)
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN npm ci --workspace=@satre/api --include-workspace-root

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY --from=deps /app/apps/api/package.json ./apps/api/package.json
COPY --from=deps /app/packages/shared-types/package.json ./packages/shared-types/package.json

COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN npx prisma generate

EXPOSE 3000

# Migrate then start (tsx runs TypeScript + workspace TS types directly)
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
