import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';
import angles from 'angles';
import {DistanceService} from './DistanceService';
import {LocationService, LatLong} from './LocationService';

@Injectable()
export class PathService {
    private _trip: Observable<LatLong[]>;

    constructor(distanceService: DistanceService, locationService: LocationService) {
        this._trip = distanceService.trip
            .withLatestFrom(locationService.current)
            .scan<LatLong[]>((acc, [, latLng]) => {
                acc.push(_.clone(latLng));
                return acc;
            }, [])
            .share();
    }

    public get trip() { return this._trip; }
}
