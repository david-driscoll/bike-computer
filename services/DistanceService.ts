import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';

@Injectable()
export class DistanceService {
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
    }

    public get odometer() { return this._odometer; }
    public get trip() { return this._trip; }
}
