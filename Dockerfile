# syntax= docker/dockerfile:1.17-labs
FROM oven/bun

RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean \
    && apt-get update -qq \
    && apt-get install -y -qq --no-install-recommends \
      parallel

WORKDIR /root/.bun/install/cache
ENV BUN_INSTALL_CACHE_DIR=/root/.bun/install/cache

WORKDIR /app
COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
  bun install --frozen-lockfile

COPY --exclude=app/api/ . .


ENTRYPOINT []
CMD ["./scripts/build.sh"]
