FROM node:14.15.0-alpine

WORKDIR /usr/src/app

COPY . .

ENV PORT 3000

ENV NODE_ENV "production"

RUN apk --no-cache add --virtual builds-deps build-base python && \
  npm install && \
  npm run build && \
  mv frontend/build /tmp/ && \
  rm -rf frontend/ && \
  mkdir frontend && \
  mv /tmp/build frontend/ && \
  rm -rf node_modules && \
  apk del builds-deps build-base python

EXPOSE 3000

CMD [ "npm", "start" ]

