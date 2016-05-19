import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';

@Injectable()
export class AccelerationService {
    private _speed: Observable<number>;
    constructor() {
        this._speed = Observable.interval(500)
            .scan((acc) => {
                return _.clamp(acc + _.random(-3, 3), 0, 20);
            }, 0)
            .share();
    }

    public get speed() { return this._speed; }
}
