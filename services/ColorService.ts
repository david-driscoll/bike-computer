import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import _ from 'lodash';
import {Color} from 'color';
import {LightsensorService, TimeOfDay} from './LightsensorService';

const speedRanges = [
    {
        speed: { start: -3, end: 5 },
        color: { start: 70, end: 0 }
    }, {
        speed: { start: 5, end: 12.5 },
        color: { start: 360, end: 230 }
    }, {
        speed: { start: 12.5, end: 20 },
        color: { start: 250, end: 160 }
    }, {
        speed: { start: 20, end: 60 },
        color: { start: 30, end: 0 }
    }
];

@Injectable()
export class ColorService {
    private _l: number = 40;
    constructor(private lightsensorService: LightsensorService) {
        this.lightsensorService.timeOfDay.subscribe(timeOfDay => {
            this._l = timeOfDay === TimeOfDay.Day ? 40 : 60;
        });
    }

    public getColorForSpeed(s: number) {
        const range = _.find(speedRanges, x => s >= x.speed.start && s < x.speed.end);
        if (range) {
            const {speed, color} = range;
            const width = Math.abs(color.end - color.start);
            const value = (s) / speed.end;
            let h: number;
            if (color.end >= color.start) {
                h = color.start + value * width;
            } else {
                h = color.start - value * width;
            }
            return new Color({ h: h, s: 100, l: this._l }).hexString();
        }
        return '#cccccc';
    }
}
