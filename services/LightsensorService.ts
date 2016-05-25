import {Observable} from 'rxjs';
import _ from 'lodash';
import {Injectable} from '@angular/core';

export enum TimeOfDay {
    Day,
    Night
}

@Injectable()
export class LightsensorService {
    private _nightTime: Observable<TimeOfDay>;

    constructor() {
        this._nightTime = Observable.interval(60000)
            .map(() => <TimeOfDay>_.random(0, 1))
            .share()
            .startWith(TimeOfDay.Day);
    }

    public get timeOfDay() {
        return this._nightTime;
    }
}
