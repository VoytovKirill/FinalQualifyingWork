FROM node:16.17.0-alpine as build-step
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:1.23
COPY ./fonts /usr/share/fonts
COPY --from=build-step /app/build /usr/share/nginx/html
