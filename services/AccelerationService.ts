import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';

@Injectable()
export class AccelerationService {
    private _forward: Observable<number>;
    private _sideways: Observable<number>;

    constructor() {
        this._forward = Observable.interval(100)
            .scan(({acc, direction}) => {
                if (acc >= 1 || acc <= 0)
                    direction = !direction;
                if (direction) {
                    acc -= 0.1;
                } else {
                    acc += 0.005;
                }
                return { acc, direction };
            }, { acc: 0, direction: true })
            .map(x => x.acc)
            .share();
    }

    public get forward() { return this._forward; }
    public get sideways() { return this._sideways; }
}
