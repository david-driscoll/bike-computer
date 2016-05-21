import {Component, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import _ from 'lodash';
import {DisposableComponent, IDisposable} from '../../helpers/disposables';
import {UIStateService, UIState} from '../services/UIStateService';
import {LightsensorService, TimeOfDay} from '../../services/LightsensorService';
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
    private _map: google.maps.Map;
    constructor(
        private ui: UIStateService,
        private lightsensor: LightsensorService,
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
            shouldLoad.filter(x => x)
                .subscribe(() => {

                    this._map = new google.maps.Map(<any>this._element, {
                        center: { lat: 35.78352363498731, lng: -78.86666017150878 },
                        scrollwheel: true,
                        panControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoom: 17
                    });

                    window['_map'] = this._map;
                }),
            shouldLoad.filter(x => !x)
                .subscribe(() => this._map = null),
            shouldLoad
                .mergeMap(() => this.lightsensor.timeOfDay)
                .subscribe(timeOfDay => {
                    if (timeOfDay === TimeOfDay.Day) {
                        this._map.setOptions({ styles: [] });
                    } else {
                        this._map.setOptions({ styles: darkStyle });
                    }
                })
        );
    }
}
