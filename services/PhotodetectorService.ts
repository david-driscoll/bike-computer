import {Observable} from 'rxjs';
import _ from "lodash";
import {Injectable} from '@angular/core';

export enum TimeOfDay {
    Day,
    Twilight,
    Night
}

@Injectable()
export class PhotodetectorService {
    private _nightTime: Observable<TimeOfDay>;

    constructor() {
        this._nightTime = Observable.interval(10000)
            .map(() => <TimeOfDay>_.random(0, 2))
            .share()
            .startWith(TimeOfDay.Day);
    }

    public get timeOfDay() {
        return this._nightTime;
    }
}
