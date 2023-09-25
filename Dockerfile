FROM --platform=linux/amd64 node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

# Installing packages
RUN yarn install --frozen-lockfile

COPY . .

# Build app
RUN yarn build

FROM node:18-alpine

RUN apk update \
	&& apk add --no-cache openssl1.1-compat \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/apk/*

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["yarn", "migrate:start"]
