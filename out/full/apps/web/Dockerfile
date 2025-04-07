ARG SERVICE_NAME=web

FROM node:18.17.0-alpine AS base

# Construi a aplicação
FROM base AS build

ARG SERVICE_NAME

WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune $SERVICE_NAME --docker

# Roda a aplicação
FROM nginx:1.25.3-alpine AS runner

ARG SERVICE_NAME

RUN apk update && apk add --repository=community && apk add nodejs npm nginx openrc

WORKDIR /app

COPY --from=build /app/out/json/ .
RUN npm pkg delete scripts.prepare
RUN npm install

COPY --from=build /app/out/full/ .

RUN npm run build -w $SERVICE_NAME

COPY --from=build /app/out/full/apps/$SERVICE_NAME/dist/* /usr/share/nginx/html/

COPY --from=build /app/out/full/apps/$SERVICE_NAME/config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]