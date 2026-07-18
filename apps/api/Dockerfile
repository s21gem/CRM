FROM node:20-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
RUN npm install

COPY . .
RUN npm run build --workspace=apps/api

FROM node:20-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/apps/api/package.json ./apps/api/
COPY --from=builder /usr/src/app/packages/ ./packages/
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist

EXPOSE 4000
CMD ["npm", "run", "start", "--workspace=apps/api"]
