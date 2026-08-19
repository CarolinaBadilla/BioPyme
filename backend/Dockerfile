# ETAPA 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# ETAPA 2: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# INSTALAR LIBRERÍAS DE OPENSSL Y COMPATIBILIDAD EN ALPINE (Crucial para Prisma)
RUN apk add --no-cache openssl libc6-compat

# Usuario sin privilegios
RUN addgroup -g 10001 -S appgroup && adduser -u 10001 -S appuser -G appgroup

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
CMD ["node", "dist/src/main.js"]