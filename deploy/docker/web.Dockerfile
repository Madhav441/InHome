FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json .eslintrc.cjs .prettierrc.json ./
COPY packages/ui-kit/package.json packages/ui-kit/
COPY apps/web/package.json apps/web/
RUN corepack enable && pnpm fetch
COPY . .
RUN pnpm install
RUN pnpm --filter @sentinel-au/config build
RUN pnpm --filter @sentinel-au/sdk-web build
RUN pnpm --filter @sentinel-au/ui-kit build
RUN pnpm --filter @sentinel-au/web build
EXPOSE 3000
CMD ["pnpm", "--filter", "@sentinel-au/web", "dev"]
