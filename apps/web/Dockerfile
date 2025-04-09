ARG SERVICE_NAME=web

ARG VITE_BACKEND_URL

FROM node:23.8.0-alpine AS base

# Construi a aplicação
FROM base AS build

ARG SERVICE_NAME

WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune $SERVICE_NAME --docker

# Instala a aplicação
FROM base AS installer

ARG SERVICE_NAME
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN apk update && apk add --repository=community && apk add nodejs npm openrc

WORKDIR /app

COPY --from=build /app/out/json/ . 
RUN npm pkg delete scripts.prepare
RUN npm install

COPY --from=build /app/out/full/ .
# Adicione esta linha para corrigir o problema do esbuild
RUN cd ./apps/$SERVICE_NAME && npm install esbuild@0.25.0 && npm rebuild esbuild
RUN npm run build -w $SERVICE_NAME

CMD tail -f /dev/null

# Roda a aplicação
FROM nginx:1.27.4-alpine AS runner

ARG SERVICE_NAME

# Copiar toda a pasta dist ao invés de apenas os arquivos da raiz
COPY --from=installer /app/apps/$SERVICE_NAME/dist /usr/share/nginx/html/

COPY --from=installer /app/apps/$SERVICE_NAME/config/nginx.conf /etc/nginx/conf.d/default.conf

# Adicionar configuração de tipos MIME corretos para JavaScript
RUN echo 'types { application/javascript js mjs; }' > /etc/nginx/conf.d/javascript_mime.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]