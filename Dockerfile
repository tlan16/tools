FROM oven/bun

WORKDIR /root/.bun/install/cache
ENV BUN_INSTALL_CACHE_DIR=/root/.bun/install/cache

WORKDIR /app
COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
  bun install --frozen-lockfile

COPY . .


ENTRYPOINT []
CMD ["./scripts/build.sh"]
