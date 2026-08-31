# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS base

WORKDIR /app
RUN corepack enable

FROM base AS dependencies

COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/design-system/package.json ./packages/design-system/package.json

RUN --mount=type=cache,target=/root/.yarn/berry/cache \
	yarn install --immutable

FROM dependencies AS builder

COPY . .

ARG VITE_APP_NAME=Limopti
ARG VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/positron

ENV NODE_ENV=production \
	PORT=3333 \
	HOST=0.0.0.0 \
	LOG_LEVEL=info \
	APP_KEY=limopti-build-only-key-not-for-runtime \
	APP_URL=http://localhost:3333 \
	DATABASE_URL=postgres://app:app@localhost:5432/limopti \
	SESSION_DRIVER=cookie \
	VITE_APP_NAME=${VITE_APP_NAME} \
	VITE_MAP_STYLE_URL=${VITE_MAP_STYLE_URL}

RUN yarn workspace @limopti/web build

FROM dependencies AS production-dependencies

RUN yarn workspaces focus @limopti/web --production

FROM node:24-alpine AS runner

ENV NODE_ENV=production \
	PORT=3333 \
	HOST=0.0.0.0 \
	LOG_LEVEL=info \
	TZ=Europe/Paris \
	SESSION_DRIVER=cookie

WORKDIR /app/apps/web/build

COPY --from=production-dependencies --chown=node:node /app/node_modules /app/node_modules
COPY --from=builder --chown=node:node /app/apps/web/build ./

USER node

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:3333/healthz').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["sh", "-c", "node ace migrate && exec node bin/server.js"]
