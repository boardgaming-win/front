FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci && npm install pm2 -g
COPY ./ecosystem.config.js ./
COPY ./.env.production ./
COPY ./next.config.js ./
COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./
RUN npm run build
RUN rm -rf .next/cache

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start-pm2:dev"]