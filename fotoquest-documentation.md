# Fotoquest Helgoland Client

## Preparation

1. Get Helgoland client: `git clone -b feature/fotoquest https://github.com/52North/helgoland.git`
1. Install [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
1. `$ cd helgoland`
1. `$ npm install` to get all dependencies

## Build Client as WAR-File

1. `$ grunt buildWar` to get a deployable `war`-file
1. Deploy `build/client##***.war` to `${CATALINA_HOME}/webapps/` folder

## Build Client as folder with static files

1. `$ grunt` to get the client in a static filed structure in the `dist` folder
1. Deploy the content of the folder in an apache oder nginx

## Further Lookups
* https://github.com/52North/helgoland
