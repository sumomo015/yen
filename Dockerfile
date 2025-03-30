FROM node:22.14.0-slim AS builder

RUN corepack enable
COPY . /app
WORKDIR /app

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM scratch
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /workspace

COPY --from=builder /app/.output /workspace/
EXPOSE ${PORT}

CMD [ "node", "--enable-source-maps", "/workspace/server/index.mjs" ]
