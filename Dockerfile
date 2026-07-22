# Build Stage for Frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy source code and Prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the frontend (Vite)
RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy backend source
COPY --from=builder /app/server ./server
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Install ts-node/tsx to run backend in production if needed, or compile it first
# For simplicity, we use tsx in production as defined in dev, but ideally it should be compiled.
RUN npm install -g tsx

# Expose port
EXPOSE 5000

# Set Node environment
ENV NODE_ENV=production

# Start the server (Backend will serve frontend from /dist if configured, else just run backend)
# You may need to ensure server/index.ts serves the static dist folder
CMD ["tsx", "server/index.ts"]
