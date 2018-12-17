FROM node:latest AS BUILD

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package.json and install dependencies
COPY package.json package-lock.json /usr/src/app/
RUN npm install

# copy the app and build it
COPY . /usr/src/app
RUN npm run build

FROM nginx:alpine
COPY --from=BUILD /usr/src/app/dist/complete /usr/share/nginx/html
