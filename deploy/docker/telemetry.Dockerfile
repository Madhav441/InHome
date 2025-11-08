FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json .eslintrc.cjs .prettierrc.json ./
COPY services/telemetry/package.json services/telemetry/
RUN corepack enable && pnpm fetch
COPY . .
RUN pnpm install --offline
EXPOSE 4100
CMD ["pnpm", "--filter", "@sentinel-au/telemetry-service", "start"]
