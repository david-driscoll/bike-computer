import {Component, ElementRef} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {ColorService} from '../../services/ColorService';
import {OpenWeatherMapService} from '../../services/OpenWeatherMapService';

const controlSize = 140;

@Component({
    selector: 'open-weather',
    styles: [`
        :host {
            position: relative;
            transition: all 0.5s ease;
            border-radius: 200px;
            position: fixed;
            bottom: 140px;
            right: -6px;
            width: ${controlSize}px;
            height: ${controlSize}px;
            z-index: 999;
            overflow: hidden;
        }

        .day :host {
        }

        img {
            height: 100%;
            width: 100%;
        }

        .temp {
            position: absolute;
            bottom: 12px;
            right: 30px;
            font-weight: 700;
            font-size: 32px;
            z-index: 1002;
            color: gold;
        }

        .day :host .temp {
            color: black;
        }
    `],
    template: `
    <div class="icon"><img [src]="icon" /></div>
    <div class="temp">{{temp}}°</div>
    `
})
export class OpenWeatherControl extends DisposableComponent {
    private _element: HTMLElement;
    public icon: string;
    public temp: number;
    public current: openweathermap.Current;

    constructor(
        private weather: OpenWeatherMapService,
        private color: ColorService,
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
        this._disposable.add(
            weather.current.subscribe(x => this.current = x),
            weather.current.subscribe(x => {
                this.icon = `img/${x.weather[0].icon}.png`;
                this.temp = _.round((x.main.temp - 273.15) * 1.8000 + 32.00, 0);
            })
        );
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();


    }
}
