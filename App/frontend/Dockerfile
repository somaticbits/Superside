# ---- Base Node ----
FROM node:lts-bullseye-slim AS build
WORKDIR /app

# ---- Frontend ----
FROM build AS frontend
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# ---- Nginx ----
FROM nginx:1.21 AS nginx
RUN apk add --no-cache certbot certbot-nginx
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]