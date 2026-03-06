# Production Dockerfile for Backend

# 1. Build environment
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm ci
COPY . .

# Build the NestJS app
RUN npm run build

# 2. Production environment
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

# Only copy required files to run the app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# Run migrations (if needed at startup, though typically done externally) and start the app
CMD [ "npm", "run", "start:prod" ]
