FROM node:latest AS BUILD

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package.json and install dependencies
COPY package.json package-lock.json /usr/src/app/
COPY scripts /usr/src/app/scripts
RUN npm install

# copy the app and build it
COPY . /usr/src/app
RUN npm run build --prod

FROM nginx:alpine
ENV PORT=80
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./52-specify-different-port.sh /docker-entrypoint.d/
RUN chmod 0775 /docker-entrypoint.d/52-specify-different-port.sh
COPY --from=BUILD /usr/src/app/dist/timeseries /usr/share/nginx/html
# the container can be started like this: docker run -p 80:80 -e PORT=80 helgoland
CMD ["nginx", "-g", "daemon off;"]
