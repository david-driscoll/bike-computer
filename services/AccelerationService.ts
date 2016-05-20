import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';
import {Color} from 'color';
const maxSpeed = 30;
const colorShiftDegrees = 180;
const speedForce = _(_.range(0, 30))
    .map(range => new Color('#ff6600').rotate(-((range + (range > 8 ? 10 : 0)) * ((colorShiftDegrees / maxSpeed)))))
    .map(color => color.hexString())
    .value();
const colorsForSpeed: { [index: number]: string } = {};
_.each(speedForce, (color, index) => colorsForSpeed[index] = color);

@Injectable()
export class AccelerationService {
    private _speed: Observable<number>;
    private _odometer: Observable<number>;
    private _trip: Observable<number>;

    constructor() {
        this._odometer = Observable.interval(100)
            .scan<number>((acc) => {
                return acc + _.random(1, 10) * _.random(1, 10) / 100000;
            }, _.random(2000, 4000))
            .map(km => km * 0.62137119)
            .share();

        this._trip = this._odometer
            .take(1)
            .mergeMap(start => this._odometer, (start, current) => current - start)
            .share();

        this._speed = Observable.zip(
            this._trip,
            this._trip.skip(10),
            (old, current) => _.round((current - old) * 60 * 60, 1))
            .share();
    }

    public get odometer() { return this._odometer; }
    public get trip() { return this._trip; }
    public get speed() { return this._speed; }

    public get maxSpeed() { return maxSpeed; }
    public getColorForSpeed(speed: number) { return colorsForSpeed[_.floor(speed)]; }
    public getColors() { return _.values(colorsForSpeed); }
}
