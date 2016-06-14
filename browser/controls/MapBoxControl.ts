import {Component, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import _ from 'lodash';
import {DisposableComponent, CompositeDisposable} from '../../helpers/disposables';
import {LightsensorService, TimeOfDay} from '../../services/LightsensorService';
import {LocationService} from '../../services/LocationService';
import {PathService} from '../../services/PathService';
import angles from 'angles';
//const mapbox = require('../../node_modules/mapbox-gl/dist/mapbox-gl.js');
//const {Map: MapBoxGl.Map, GeoJSONSource, LngLat} = <MapBoxGl>mapbox;
const mapbox: typeof MapBox = require('../../node_modules/mapbox-gl/dist/mapbox-gl.js');
var {Map, GeoJSONSource, LngLat} = mapbox;
const lightStyle = 'mapbox://styles/david-driscoll/cioi59qdt0010aunn2k23tg7a';
const darkStyle = 'mapbox://styles/david-driscoll/cioheaaph000naokp758ijj37';

// Directions
const directions: typeof MapBoxDirections = require('../../node_modules/mapbox-gl-directions/index.js');
var {Directions} = directions;


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

    .center {
        position: absolute !important;
        bottom: 20px;
        width: 100px;
        text-align: center;
        left: 50%;
        margin-left: -50px;
        display: none;
        cursor: pointer;
        border-radius: 10px;
        color: gold;
        background-color: black;
        border: 2px solid gold;
    }

    .day :host .center {
        color: black;
        background-color: white;
        border: 2px solid black;
    }

    .center.show {
        display: block;
    }

    .mapboxgl-map {
        width: 100%;
        height: 100%;
    }
    `],
    template: `
    <div class></div>
    <div class="center" [class.show]="_panning" (click)="_panning = false"><i class="fa fa-location-arrow"></i> Center</div>
    `
})
export class MapBoxControl extends DisposableComponent {
    private _element: HTMLElement;
    private _mapDisposable: CompositeDisposable;
    private _map: MapBox.Map;
    private _directions: MapBoxDirections.Directions;
    private _me: MapBox.GeoJSONSource;
    private _trip: MapBox.GeoJSONSource;
    private _tripData: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: []
    };
    private _panning = false;
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

        this._disposable.add(
            Observable.merge(
                Observable.zip(this.lightsensor.timeOfDay.take(1), this.location.current.take(1), (timeOfDay, location) => ({ timeOfDay, location })),
                this.lightsensor.timeOfDay
                    .switchMap(timeOfDay => this.location.current.take(1), (timeOfDay, location) => ({ timeOfDay, location }))
            )
                .do(() => {
                    if (this._mapDisposable) this._mapDisposable.dispose();
                })
                .subscribe(({ timeOfDay, location }) => this._mapDisposable = this.buildMap(timeOfDay, location))
        );
    }

    public buildMap(timeOfDay: TimeOfDay, location: [number, number]) {
        var disposable = new CompositeDisposable;

        const map = this._map = new Map({
            container: this._element.firstElementChild,
            minZoom: 14,
            maxZoom: 17,
            zoom: 17,
            center: location,
            hash: false,
            style: timeOfDay === TimeOfDay.Day ? lightStyle : darkStyle
        });

        const directions = this._directions = new Directions({
            unit: 'metric',
            container: 'directions',
            profile: 'walking',
            proximity: [0,0]
        });

        map.addControl(directions);

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
                Observable.fromEvent(this._map, "dragstart")
                    .subscribe(x => this._panning = true),
                this.location.current
                    .subscribe(([lng, lat]) => {
                        if (!this._panning) {
                            this._map.setCenter(new LngLat(lng, lat));
                        }
                        this._me.setData({
                            type: 'Point',
                            coordinates: [lng, lat]
                        });
                    }),
                this.location.facing
                    .auditTime(100)
                    .subscribe(degree => {
                        if (!this._panning) {
                            this._map.rotateTo(degree);
                            map.setLayoutProperty('me', 'icon-rotate', 0);
                        } else {
                            // TODO: Calculate the proper angle relative to current bearing
                            map.setLayoutProperty('me', 'icon-rotate', 0);
                        }
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
    
    public getDirections(currentLocation:MapBox.Point, destination:MapBox.Point){
    }
}
