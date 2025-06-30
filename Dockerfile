# 1. Dependencies Stage
FROM node:18-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# 2. Builder Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ARG DATABASE_URL
ARG MINIO_URL
# Add any other build-time secrets here
# ARG NEXT_PUBLIC_...

# Build the Next.js application
RUN pnpm build

# 3. Runner Stage
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production

# Install pnpm for the runner
RUN npm install -g pnpm

# Copy built app from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
