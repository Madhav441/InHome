# Project Log

## 2026-01-18

- Added `compose:up` script to run the Docker Compose demo from the repo root.
- Added a root `.dockerignore` to prevent large/invalid build contexts during Docker Compose builds.
- Updated Dockerfiles to use online `pnpm install` so missing packages can be fetched during image builds.
- Ensured shared workspace packages build before app builds in Dockerfiles to satisfy local module resolution.
- Added `@types/node` to the config package so DTS builds succeed in containers.
- Added `@types/node` to the sdk-web package for DTS builds in containers.
