import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import L from 'leaflet';

@Component({
    selector: 'n52-geometry-map-viewer',
    templateUrl: './geometry-map-viewer.component.html'
})
export class GeometryMapViewerComponent implements OnInit, OnChanges {

    @Input()
    public mapId: string;

    @Input()
    public highlight: any;

    @Input()
    public geometry: any;

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

    public ngOnInit(): any {
        setTimeout(() => {

            this.map = L.map(this.mapId, {
                maxZoom: this.maxMapZoom || 10
            }).setView([51.505, -0.09], 13);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            const geojson = L.geoJSON(this.geometry, {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, this.defaultStyle);
                }
            });

            geojson.setStyle(this.defaultStyle);
            geojson.addTo(this.map);

            this.map.fitBounds(geojson.getBounds());

        }, 100);
    }


    public ngOnChanges(changes: SimpleChanges) {
        if (changes.highlight && changes.highlight.currentValue) {
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
    }
}
