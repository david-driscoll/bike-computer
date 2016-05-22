import {Component, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import _ from 'lodash';
import {DisposableComponent, CompositeDisposable, IDisposable} from '../../helpers/disposables';
import {UIStateService, UIState} from '../services/UIStateService';
import {LightsensorService, TimeOfDay} from '../../services/LightsensorService';
import {LocationService, LngLatArray} from '../../services/LocationService';
import {PathService} from '../../services/PathService';
import googleMaps from 'google-maps';
import {createObservable} from '../../helpers/observableCreate';

const apiKey: string = require('../../vendor/maps-api-key.json').google;
const darkStyle = [
    {
        'stylers': [
            { 'invert_lightness': true }
        ]
    }, {
        'featureType': 'landscape',
        'stylers': [
            { 'saturation': -100 },
            { 'invert_lightness': true },
            { 'gamma': 0.05 }
        ]
    }
];

function mapLoader() {
    return createObservable<any>(observer => {
        googleMaps.load(() => observer.next());
        return () => googleMaps.release(function () { /* */ });
    });
}

@Component({
    selector: 'google-map',
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
export class GoogleMapControl extends DisposableComponent {
    private _element: HTMLElement;
    private _map: GoogleMap;
    constructor(
        private ui: UIStateService,
        private lightsensor: LightsensorService,
        private path: PathService,
        private location: LocationService,
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        const shouldLoad = this.ui.state
            .switchMap(state => {
                if (state === UIState.Maps) {
                    return mapLoader().map(x => true);
                } else {
                    return Observable.of(false);
                }
            })
            .share();

        googleMaps.KEY = apiKey;

        this._disposable.add(
            shouldLoad
                .subscribe((load) => {
                    if (load) {
                        if (this._map) {
                            this._map.dispose();
                        }
                        this._map = new GoogleMap(this._element, this.path, this.location, this.lightsensor);
                    } else {
                        if (this._map) {
                            this._map.dispose();
                        }
                        this._map = null;
                    }
                }),
            shouldLoad.filter(x => !x)
                .subscribe(() => this._map.dispose())
        );
    }
}

export class GoogleMap implements IDisposable {
    private _disposable = new CompositeDisposable();
    private _map: google.maps.Map;
    private _me: google.maps.Marker;
    private _trip: google.maps.Polyline;

    constructor(
        private element: HTMLElement,
        private path: PathService,
        private location: LocationService,
        private lightsensor: LightsensorService) {
        const map = this._map = new google.maps.Map(element, {
            center: { lat: 35.78352363498731, lng: -78.86666017150878 },
            scrollwheel: true,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoom: 17,
            tilt: 45
        });

        this._me = new google.maps.Marker({
            position: map.getCenter(),
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 2,
            },
            draggable: false,
            map
        });

        this._trip = new google.maps.Polyline({
            map,
        });

        window['_map'] = this._map;

        this._disposable.add(
            this.lightsensor.timeOfDay
                .subscribe(timeOfDay => {
                    if (timeOfDay === TimeOfDay.Day) {
                        this._map.setOptions({ styles: [] });
                    } else {
                        this._map.setOptions({ styles: darkStyle });
                    }
                }),
            this.location.current
                .subscribe(([lng, lat]) => {
                    this._map.setCenter({ lng, lat });
                }),
            this.location.facing
                .subscribe(degree => {
                    this._map.setHeading(degree);
                }),
            this.path.trip
                .subscribe(path => {
                    this._trip.setPath(path.map(([lng, lat]) => ({ lng, lat })));
                })
        );
    }

    public dispose() {
        return this._disposable.dispose();
    }
}
