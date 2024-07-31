# ---- Base Node ----
FROM node:lts-bullseye-slim AS build
WORKDIR /app

# ---- Backend ----
FROM build AS backend
WORKDIR /app/backend
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# ---- Release ----
FROM build AS release
WORKDIR /app
COPY --from=backend /app/backend/dist ./backend
COPY package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

CMD ["node", "server.js"]