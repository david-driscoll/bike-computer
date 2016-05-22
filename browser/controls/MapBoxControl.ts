import {Component, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {LightsensorService} from '../../services/LightsensorService';
import {LocationService} from '../../services/LocationService';
import {PathService} from '../../services/PathService';
//const mapbox = require('../../node_modules/mapbox-gl/dist/mapbox-gl.js');
//const {Map: MapBoxGl.Map, GeoJSONSource, LngLat} = <MapBoxGl>mapbox;
const mapbox: typeof MapBox = require('../../node_modules/mapbox-gl/dist/mapbox-gl.js');
var {Map, GeoJSONSource, LngLat} = mapbox;

const apiKey: string = require('../../vendor/maps-api-key.json').mapbox;
mapbox.accessToken = apiKey;

@Component({
    selector: 'mapbox',
    styles: [`
    :host {
        position: fixed !important;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    `],
    template: `<div></div>`
})
export class MapBoxControl extends DisposableComponent {
    private _element: HTMLElement;
    private _map: MapBox.Map;
    private _me: MapBox.GeoJSONSource;
    private _trip: MapBox.GeoJSONSource;
    private _tripData: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: []
    };
    constructor(
        private lightsensor: LightsensorService,
        private path: PathService,
        private location: LocationService,
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();

        this.location.current.take(1).subscribe(location => {
            const map = this._map = new Map({
                container: this._element,
                minZoom: 14,
                maxZoom: 17,
                zoom: 17,
                center: location,
                hash: false,
                style: 'mapbox://styles/mapbox/streets-v8'
            });

            map.on('load', () => {
                map.setPitch(50);

                this._trip = new GeoJSONSource({
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: this._tripData
                    }
                });
                map.addSource('trip', this._trip);

                map.addLayer({
                    "id": "trip",
                    "type": "line",
                    "source": "trip",
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    "paint": {
                        "line-color": "#888",
                        "line-width": 8
                    }
                });

                this._me = new GeoJSONSource({
                    data: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });
                map.addSource('me', this._me);

                map.addLayer({
                    'id': 'me',
                    'type': 'symbol',
                    'source': 'me',
                    'layout': {
                        'icon-image': 'airport-15',
                    }
                });

                window['_map'] = this._map;

                this._disposable.add(
                    () => this._map.remove(),
                    this.lightsensor.timeOfDay
                        .subscribe(timeOfDay => {
                            // if (timeOfDay === TimeOfDay.Day) {
                            //     this._map.setOptions({ styles: [] });
                            // } else {
                            //     this._map.setOptions({ styles: darkStyle });
                            // }
                        }),
                    this.location.current
                        .subscribe(([lng, lat]) => {
                            this._map.setCenter(new LngLat(lng, lat));
                            this._me.setData({
                                type: 'Point',
                                coordinates: [lng, lat]
                            });
                        }),
                    this.location.facing
                        .auditTime(100)
                        .subscribe(degree => {
                            this._map.rotateTo(degree);
                            //map.setLayoutProperty('me', 'icon-rotate', degree);
                        }),
                    this.path.trip
                        .auditTime(1000)
                        .subscribe(path => {
                            this._tripData.coordinates = path;
                            this._trip.setData(this._tripData);
                        })
                );

            });

        });
    }
}
