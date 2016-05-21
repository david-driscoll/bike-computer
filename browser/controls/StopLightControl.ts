import {Component, ElementRef, Input} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent, IDisposable} from '../../helpers/disposables';
import {UIStateService, UIState} from '../services/UIStateService';
import {IndicatorService} from '../../services/IndicatorService';
import {Led} from './Led';

@Component({
    selector: 'stoplight',
    styles: [`
    `],
    template: `
    `
})
export class StopLightControl extends DisposableComponent {
    private _timer: IDisposable;
    private _element: HTMLElement;
    private _state: boolean[] = _.range(0, 12).map(x => false);
    private _leds: Led[] = [];
    constructor(
        private ui: UIStateService,
        private indicator: IndicatorService,
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        for (let i = 0; i < this._state.length; i++)
            this._leds.push(new Led(this._element, '#ff1111'));

        this._disposable.add(
            this.ui.state.subscribe(state => {
                if (state === UIState.Zoom) {
                    _.each(this._leds, led => led.size = 16);
                } else {
                    _.each(this._leds, led => led.size = 12);
                }
            }),
            this.indicator.stop.subscribe(stop => _.each(this._leds, led =>{
                led.on = stop;
            }))
        );
    }
}
