# LyricNote Backend Dockerfile - pnpm Monorepo
FROM node:20-alpine AS base

# Install pnpm 9.x (must match the version used to generate pnpm-lock.yaml)
RUN corepack enable && corepack prepare pnpm@9 --activate

# Install dependencies only when needed
FROM base AS deps
# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files for workspace
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install dependencies for all workspace packages
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy shared package source code
COPY packages/shared ./packages/shared

# Copy backend package source code
COPY packages/backend ./packages/backend

# Ensure public directory exists
RUN mkdir -p /app/packages/backend/public

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm build

# Build backend
WORKDIR /app/packages/backend
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output (includes entire monorepo structure)
COPY --from=builder --chown=nextjs:nodejs /app/packages/backend/.next/standalone ./

# Copy static files to the correct location within the monorepo structure
COPY --from=builder --chown=nextjs:nodejs /app/packages/backend/.next/static ./packages/backend/.next/static

# Copy public files
COPY --from=builder --chown=nextjs:nodejs /app/packages/backend/public ./packages/backend/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start the application from the backend package directory
WORKDIR /app/packages/backend
CMD ["node", "server.js"]