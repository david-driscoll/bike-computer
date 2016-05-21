import {Component, ElementRef, Input} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent, Disposable, IDisposable} from '../../helpers/disposables';
import {UIStateService, UIState} from '../services/UIStateService';
import {IndicatorService} from '../../services/IndicatorService';
import {Led} from './Led';

@Component({
    selector: 'taillight',
    styles: [`
    `],
    template: `
    `
})
export class TailLightControl extends DisposableComponent {
    private _timer: IDisposable;
    private _element: HTMLElement;
    private _state: boolean[] = _.range(0, 8).map(x => false);
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
            this._leds.push(new Led(this._element, '#FAF20A'));

        this._disposable.add(
            this.ui.state.subscribe(state => {
                if (state === UIState.Zoom) {
                    _.each(this._leds, led => led.size = 12);
                } else {
                    _.each(this._leds, led => led.size = 8);
                }
            }),
            (this.direction === 'right' ? this.indicator.rightTurn : this.indicator.leftTurn)
                .subscribe(turn => this.on = turn)
        );
    }

    public ngAfterViewChecked() {
        if (!this._timer && this.on) {
            const timer = setInterval(this._animate, 90);
            this._timer = Disposable.create(() => {
                clearInterval(timer);
                _.each(this._state, (x, i) => {
                    this._state[i] = false;
                    const led = this._getLed(i);
                    led.on = false;
                });
            });
            this._disposable.add(this._timer);
        } else if (this._timer && !this.on) {
            this._timer.dispose();
            this._disposable.remove(this._timer);
            this._timer = null;
        }
    }

    private _getLed(index: number) {
        if (this.direction === 'right') {
            return this._leds[index];
        } else {
            return this._leds[7 - index];
        }
    }

    private _animate = () => {
        if (_.last(this._state)) {
            _.each(this._state, (x, i) => {
                this._state[i] = false;
                const led = this._getLed(i);
                led.on = false;
            });
        } else {
            const index = _.indexOf(this._state, false);
            this._state[index] = true;
            const led = this._getLed(index);
            led.on = true;
        }
    }

    @Input()
    public direction: 'left' | 'right';

    @Input()
    public on: boolean = false;
}
