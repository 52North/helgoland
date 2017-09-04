import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'n52-geometry-map-viewer',
    templateUrl: './geometry-map-viewer.component.html'
})
export class GeometryMapViewerComponent implements AfterViewInit, OnChanges {

    @Input()
    public mapId: string;

    @Input()
    public highlight: GeoJSON.GeometryObject;

    @Input()
    public geometry: GeoJSON.GeometryObject;

    @Input()
    public maxMapZoom: number;

    private map;
    private highlightGeometry;

    private defaultStyle: () => {
        color: 'red',
        weight: 5,
        opacity: 0.65
    };

    private highlightStyle = {
        color: 'blue',
        weight: 10,
        opacity: 1
    };

    constructor(
    ) { }

    public ngAfterViewInit() {
        this.map = L.map(this.mapId, {
            maxZoom: this.maxMapZoom || 10
        }).setView([0, 0], 0);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.drawGeometry();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.map) {
            if (changes.highlight && changes.highlight.currentValue) {
                this.showHighlight();
            }
            if (changes.geometry) {
                this.drawGeometry();
            }
        }
    }

    private showHighlight() {
        if (this.highlightGeometry) {
            this.map.removeLayer(this.highlightGeometry);
        }
        this.highlightGeometry = L.geoJSON(this.highlight, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, this.highlightStyle);
            }
        });
        this.highlightGeometry.setStyle(this.highlightGeometry);
        this.highlightGeometry.addTo(this.map);
    }

    private drawGeometry() {
        if (this.geometry) {
            const geojson = L.geoJSON(this.geometry, {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, this.defaultStyle);
                }
            });

            geojson.setStyle(this.defaultStyle);
            geojson.addTo(this.map);

            this.map.fitBounds(geojson.getBounds());
        }
    }
}
