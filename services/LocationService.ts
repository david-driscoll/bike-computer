import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';
import angles from 'angles';
import {DistanceService} from './DistanceService';

export interface LatLong {
    lat: number;
    lng: number;
}

@Injectable()
export class LocationService {
    private _speed: Observable<number>;
    private _facing: Observable<number>;
    private _current: Observable<LatLong>;
    private _maxSpeed = 30;

    constructor(distanceService: DistanceService) {
        this._speed = Observable.zip(
            distanceService.trip,
            distanceService.trip.skip(10),
            (old, current) => _.round((current - old) * 60 * 60, 1))
            .share();

        this._facing = Observable.interval(100)
            .scan(({acc, direction}) => {
                if (acc >= 359 || acc <= 0)
                    direction = !direction;
                if (direction) {
                    acc -= 1;
                } else {
                    acc += 1;
                }
                return { acc, direction };
            }, { acc: 0, direction: true })
            .map(x => x.acc)
            .share();

        this._current = Observable.interval(100)
            .scan((acc) => {
                const c = _.clone(acc);
                c.lat += _.random(-0.00000000000001, 0.00000000000001, true);
                c.lng += _.random(-0.00000000000001, 0.00000000000001, true);
                return acc;
            }, { lat: 35.78352363498731, lng: -78.86666017150878 })
            .share();
    }

    public get speed() { return this._speed; }
    public get maxSpeed() { return this._maxSpeed; }

    public get facing() { return this._facing; }
    public compass(degrees: number) {
        return angles.compass(degrees);
    }

    public get current() { return this._current; }
}
