## Content
This is a frontend component of the repository [sensorweb-client-core] (https://github.com/52North/sensorweb-client-core). 

It comprise:

* the styling files for the client
* the templates to define the html structure
* the images and fonts which are used in this client

## Get the client as war-file

Get a runnable client as war-file of the current development status with the following steps:

* `git clone` this repository
* run `npm install` to get all dependencies
* with `grunt buildWar` you get a war-file in the `build`-directory

## Configuration

You can change the configuration for the client in the `settings.json` in the `www`-folder of the repository. The following configuration are available:

##### `defaultProvider`

```json
"defaultProvider": {
    "serviceID": "srv_3dec8ce040d9506c5aba685c9d134156",
    "url": "http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/"
}
```
The default selected provider to show stations in the map.

##### `restApiUrls`

```json
"restApiUrls": {
    "http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/": "52nSensorweb",
    "http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/": "52nSensorwebTestbed",
}
```
A list of timeseries-API urls and an appropriate identifier to create internal timeseries ids.

##### `supportedLanguages`

```json
"supportedLanguages": [{
        "code": "de",
        "label": "Deutsch"
    }, {
        "code": "en",
        "label": "english"
    }
]
```
These are the supported languages in the client. For every language there must exist a translation file in the i18n folder.

##### `baselayer`

```json
"baselayer": {
    "mapbox": {
        "name": "Mapbox",
        "type": "xyz",
        "url": "http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg",
        "layerOptions": {
            "attribution": "&copy; <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png'/>"
        }
    }
}
```
All configured baselayer can be selected in the map.

##### `overlay`

```json
"overlay": {
}
```
Same effect as the baselayer configuration.

##### `showScale`

```json
"showScale": true
```
Show the scale bar in the map.

##### `commonLineWidth`

```json
"commonLineWidth": 1
```
Common line width of a timeseries in the chart.

##### `selectedLineWidth`

```json
"selectedLineWidth": 4,
```
Line width of a selected timeseries in the chart.

## How to develop

To develop the [sensorweb-client-core] (https://github.com/52North/sensorweb-client-core) and this frontend client components parallel you can use `bower link` as described [here] (https://oncletom.io/2013/live-development-bower-component/)

## License

Licensed under Apache License 2.0