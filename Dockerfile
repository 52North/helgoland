FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm --quiet install --silent --allow-root install && npm --quiet install grunt-cli

COPY . /usr/src/app

RUN ./node_modules/grunt-cli/bin/grunt

EXPOSE 8080

CMD [ "./node_modules/http-server/bin/http-server", "--cors", "-p", "8080", "dist"]
