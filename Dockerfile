# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# ---- Deps (install) ----
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---- Build (ts -> dist) ----
FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Dev image (hot-reload + entrypoint) ----
FROM base AS dev
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# ✅ entrypoint'i volume ile ezilmeyen bir yere koy
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# ---- Prod image (sade runtime) ----
FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=deps /usr/src/app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
