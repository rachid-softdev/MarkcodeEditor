FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY . .
RUN pnpm install --no-frozen-lockfile

FROM base AS dev
WORKDIR /app
ENV NODE_ENV development

COPY --from=deps /app ./
RUN mkdir -p /app/node_modules
RUN apk add --no-cache bash
RUN npm install -g pnpm

EXPOSE 3000
CMD ["pnpm", "dev"]
