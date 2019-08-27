# Helgoland

## Description

### Visual Exploration and Analysis of Sensor Web Data

**This lightweight web application enables the exploration, analysis and visualization of sensor web data in various fields of use, e.g. hydrology, meteorology, environmental monitoring, traffic management.**

Helgoland is a lightweight web application to explore, analyze and visualize a broad range of sensor data. You can:

- explore stations or mobile sensor platforms in a map,
- select time series by a list selection,
- visualize time series data,
- or create favorites of selected time series.

The application is based on HTML, JavaScript and CSS and can connect to different Sensor Web endpoints (REST-APIs). These Sensor Web REST-APIs provide a thin access layer to sensor data via RESTful Web binding with different output formats.

Features:

- access to SOS instances via REST-APIs (supports OGC SOS spec...)
- diagram view of multiple time series, temporal zooming & panning...
- data export (CSV)
  <!-- * Combination w/ R... -->

The following main frameworks are used to provide this application:

- [Angular](https://angular.io/)
- [Leaflet](http://leafletjs.com/)
- [Bootstrap](http://getbootstrap.com/)
- [momentJs](http://momentjs.com/)
- [d3](https://d3js.org/)

## Quick Start (Configuration)

Download the latest version of [Helgoland](https://github.com/52North/helgoland/releases).

- Deploy the war-file of the client in your favorite web container (e.g. tomcat)
- Deploy as a static web page in a web server (e.g. apache)

Configure your client in the settings.json in the root folder. Check this(link) site for the different configuration parameter in the settings.json. The main parameters are:

- `defaultProvider` - this is the default selected provider, when the user starts the client
- `datasetApis` - this is a list of all supported providers by the client

## License

Helgoland is licensed under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).

## User guide/tutorial

## Demo

Explore, analyze and visualize sensor web data with our [Helgoland](http://sensorweb.demo.52north.org/client/#/) demo.

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/3830314/15780576/ae8cf458-29a2-11e6-89ef-bc6f1453e38b.png" alt="Helgoland map view" width="75%"/>
  <img src="https://cloud.githubusercontent.com/assets/3830314/15780591/bdb9a4a8-29a2-11e6-9938-1717a0e7bb7a.png" alt="Helgoland diagram view" width="75%"/>
</p>

## Changelog

## References

## Contact

<a href="https://github.com/janschulte">
  <img src="https://avatars1.githubusercontent.com/u/3830314?v=3&s=140" alt="Webpack and Angular 2" width="48" height="48"/>
</a>

## Credits

## How to contribute

This is a frontend component of the repository [sensorweb-client-core](https://github.com/52North/sensorweb-client-core).

It comprises:

- the styling files for the client
- the templates to define the html structure
- the images and fonts which are used in this client

### Requirements to develop or build the client

- git
- [nodejs](https://nodejs.org) and [npm](https://www.npmjs.com/)

### Get ready to start

#### Clone and install

- `git clone` this repository
- run `npm install` to get all dependencies

#### Start the client in the development mode

- `npm start` starts the client on [localhost:4200](http://localhost:4200).

#### Build the client

- `npm run build` bundles the client to the `dist/timeseries` folder. The content of this folder can be deployed on a web server.
<!-- - `npm run build` will also generates a war-file in `build`-folder. -->

#### How to develop

<!-- See [here](https://github.com/52North/sensorweb-client-core#how-to-develop) for more informations. -->

#### Configuration

<!-- See [here](https://github.com/52North/sensorweb-client-core#configuration) -->

<!--## Extensions (Backends, etc., z.B. SOS )
## Road Map/development plans (features, focus…)
## Architecture/Design
## JavaDoc
not needed
## XML Schemata
## contributor
see Github...

## Requirements-->
