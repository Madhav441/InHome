FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json .eslintrc.cjs .prettierrc.json ./
COPY services/classifier/package.json services/classifier/
RUN corepack enable && pnpm fetch
COPY . .
RUN pnpm install --offline
EXPOSE 4300
CMD ["pnpm", "--filter", "@sentinel-au/classifier-service", "start"]
