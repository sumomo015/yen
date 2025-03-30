FROM node:22.14.0-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM scratch
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /workspace
USER nuxt

COPY --from=builder --chown=nuxt:nuxt /app/.output /workspace/
EXPOSE ${PORT}

CMD [ "node", "--enable-source-maps", "/workspace/server/index.mjs" ]
