#
FROM node:14.5.0-alpine

RUN mkdir /app

WORKDIR /app

COPY ["package.json", "package-lock.json*", "tsconfig.build.json", "tsconfig.json", "./"]

RUN npm install --no-cache

COPY . .

RUN npm run build

EXPOSE 8057

CMD [ "node", "dist/main.js" ]