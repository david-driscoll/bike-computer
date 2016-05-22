import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';
import angles from 'angles';
import {DistanceService} from './DistanceService';

export type LngLatArray = [number, number];

@Injectable()
export class LocationService {
    private _speed: Observable<number>;
    private _facing: Observable<number>;
    private _current: Observable<LngLatArray>;
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
            .scan<LngLatArray>((acc) => {
                const c: LngLatArray = [acc[0], acc[1]];
                c[0] += _.random(0, 1) ? -0.00007 : 0.00007;
                c[1] += _.random(0, 1) ? -0.00007 : 0.00007;
                return c;
            }, [-78.86666017150878, 35.78352363498731])
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
