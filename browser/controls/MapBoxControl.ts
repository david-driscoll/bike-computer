import {Component, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import _ from 'lodash';
import {DisposableComponent, CompositeDisposable} from '../../helpers/disposables';
import {LightsensorService, TimeOfDay} from '../../services/LightsensorService';
import {LocationService} from '../../services/LocationService';
import {PathService} from '../../services/PathService';
//const mapbox = require('../../node_modules/mapbox-gl/dist/mapbox-gl.js');
//const {Map: MapBoxGl.Map, GeoJSONSource, LngLat} = <MapBoxGl>mapbox;
const mapbox: typeof MapBox = require('../../node_modules/mapbox-gl/dist/mapbox-gl.js');
var {Map, GeoJSONSource, LngLat} = mapbox;
const lightStyle = 'mapbox://styles/david-driscoll/cioi59qdt0010aunn2k23tg7a';
const darkStyle = 'mapbox://styles/david-driscoll/cioheaaph000naokp758ijj37';

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
    private _mapDisposable: CompositeDisposable;
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

        this._disposable.add(Observable.merge(
            Observable.zip(this.lightsensor.timeOfDay.take(1), this.location.current.take(1), (timeOfDay, location) => ({ timeOfDay, location })),
            this.lightsensor.timeOfDay
                .mergeMap(timeOfDay => this.location.current.take(1), (timeOfDay, location) => ({ timeOfDay, location })))
            .do(() => {
                if (this._mapDisposable) this._mapDisposable.dispose();
            })
            .subscribe(({ timeOfDay, location }) => this._mapDisposable = this.buildMap(timeOfDay, location)));
    }

    public buildMap(timeOfDay: TimeOfDay, location: [number, number]) {
        var disposable = new CompositeDisposable;

        const map = this._map = new Map({
            container: this._element,
            minZoom: 14,
            maxZoom: 17,
            zoom: 17,
            center: location,
            hash: false,
            style: timeOfDay === TimeOfDay.Day ? lightStyle : darkStyle
        });

        disposable.add(
            () => this._disposable.remove(disposable),
            () => this._map.remove()
        );

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

            this._me = new GeoJSONSource({
                data: {
                    type: 'Point',
                    coordinates: [0, 0]
                }
            });
            map.addSource('me', this._me);

            map.addLayer({
                'id': 'trip',
                'type': 'line',
                'source': 'trip',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });

            map.addLayer({
                'id': 'me',
                'type': 'symbol',
                'source': 'me',
                'layout': {
                    'icon-image': 'airport-15',
                }
            });

            window['_map'] = this._map;

            disposable.add(
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
        return disposable;
    }
}
