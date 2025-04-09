ARG SERVICE_NAME=api

FROM node:23.8.0-slim AS base

# Construi a aplicação
FROM base AS build

ARG SERVICE_NAME

WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN npx turbo prune $SERVICE_NAME --docker


# Instala a aplicação
FROM base as installer

ARG SERVICE_NAME

RUN apt-get update &&apt-get install -y --no-install-recommends libc6

WORKDIR /app

COPY --from=build /app/out/json/ .
RUN npm pkg delete scripts.prepare
RUN npm install

COPY --from=build /app/out/full/ .
RUN npx turbo run build --filter=$SERVICE_NAME...

# Roda a aplicação
FROM base AS runner

ARG SERVICE_NAME

WORKDIR /app

# Copie apenas os arquivos necessários para produção
COPY --from=installer /app ./

# Executar migrações e iniciar a aplicação
CMD npm run migration:run -w api && npm run start:prod -w api