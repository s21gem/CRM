FROM node:20-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/
RUN npm install

COPY . .
RUN npm run build --workspace=apps/web

FROM node:20-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/apps/web/.next/standalone ./
COPY --from=builder /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /usr/src/app/apps/web/public ./apps/web/public

EXPOSE 3000
ENV PORT 3000
CMD ["node", "apps/web/server.js"]
