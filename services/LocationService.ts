import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';
import angles from 'angles';
import {DistanceService} from './DistanceService';

@Injectable()
export class LocationService {
    private _speed: Observable<number>;
    private _heading: Observable<number>;
    private _maxSpeed = 30;

    constructor(distanceService: DistanceService) {
        this._speed = Observable.zip(
            distanceService.trip,
            distanceService.trip.skip(10),
            (old, current) => _.round((current - old) * 60 * 60, 1))
            .share();

        this._heading = Observable.interval(100)
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
    }

    public get speed() { return this._speed; }
    public get maxSpeed() { return this._maxSpeed; }
    public get heading() { return this._heading; }
    public compass(degrees: number) {
        return angles.compass(degrees);
    }
}
