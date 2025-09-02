#!/bin/sh
set -e

# Prisma client generate
npx prisma generate

# Development için migrationları otomatik uygula / oluştur
npx prisma migrate dev --name init || true

# Uygulamayı başlat
exec npm run start:dev
