import {Observable} from 'rxjs';
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
        this._nightTime = Observable.of(TimeOfDay.Night);
    }

    public get timeOfDay() {
        return this._nightTime;
    }
}
