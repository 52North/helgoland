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
ENV BASE_HREF=/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./52-*.sh /docker-entrypoint.d/
RUN chmod 0775 /docker-entrypoint.d/52-*.sh
COPY --from=BUILD /usr/src/app/dist/timeseries /usr/share/nginx/html
#
# the container can be started like this:
#
# docker run --publish 80:80 --env PORT=80 --rm 52north/helgoland
#
# this make helgoland available via http://localhost:80/ and 
# removes the container after stopping it
#
CMD ["nginx", "-g", "daemon off;"]
