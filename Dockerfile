FROM node:20-alpine AS builder

WORKDIR /app

# Jenkins에서 .env 추가하기
COPY package*.json ./

RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build
# RUN npm run test

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/env ./env

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
