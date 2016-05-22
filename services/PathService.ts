import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';
import angles from 'angles';
import {DistanceService} from './DistanceService';
import {LocationService, LngLatArray} from './LocationService';

@Injectable()
export class PathService {
    private _trip: Observable<LngLatArray[]>;

    constructor(distanceService: DistanceService, locationService: LocationService) {
        this._trip = distanceService.trip
            .auditTime(2000)
            .withLatestFrom(locationService.current)
            .scan<LngLatArray[]>((acc, [, lngLat]) => {
                acc.push([lngLat[0], lngLat[1]]);
                return acc;
            }, [])
            .share();
    }

    public get trip() { return this._trip; }
}
