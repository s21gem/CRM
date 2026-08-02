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

# Build the backend
RUN npm run build:server

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy compiled backend
COPY --from=builder /app/dist/server ./server-dist

# Copy generated Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose port
EXPOSE 5000

# Set Node environment
ENV NODE_ENV=production

# Start the server using compiled JavaScript
CMD ["node", "server-dist/index.js"]
