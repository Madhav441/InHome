FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json .eslintrc.cjs .prettierrc.json ./
COPY services/api/package.json services/api/
RUN corepack enable && pnpm fetch
COPY . .
RUN pnpm install --offline
RUN pnpm --filter @sentinel-au/api build
EXPOSE 4000
CMD ["pnpm", "--filter", "@sentinel-au/api", "start"]
