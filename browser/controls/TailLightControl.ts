import {Component, ElementRef, Input, ViewChild, AfterViewChecked} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent, Disposable, IDisposable} from '../../helpers/disposables';
import {LightsensorService, TimeOfDay} from '../../services/LightsensorService';
import {LocationService} from '../../services/LocationService';
import {ColorService} from '../../services/ColorService';
import {UIStateService, UIState} from '../services/UIStateService';
import {Color} from 'color';
import {mutate} from 'fastdom';

export class Led {
    private _element: HTMLElement;
    private _offColor: string;
    private _offBorder: string;
    private _onColor: string;
    private _onBorder: string;

    constructor(parent: HTMLElement, color: string) {
        this._element = document.createElement('span');
        this._element.style.display = 'inline-block';
        this._element.style.borderStyle = 'solid';
        this.size = this._size;
        this.color = color;

        parent.appendChild(this._element);
    }

    private _on = false;
    public get on() { return this._on; }
    public set on(value) {
        this._on = value;
        mutate(() => {
            this._element.style.borderColor = value ? this._onBorder : this._offBorder;
            this._element.style.backgroundColor = value ? this._onColor : this._offColor;
        });
    }

    private _color: string;
    public get color() { return this._color; }
    public set color(value) {
        this._color = value;
        this._offColor = new Color(this._color).darken(0.32).hexString();
        this._offBorder = new Color(this._color).darken(0.44).hexString();
        this._onColor = new Color(this._color).hexString();
        this._onBorder = new Color(this._color).darken(0.12).hexString();
        this.on = this._on;
    }

    private _size = 8;
    public get size() { return this._size; }
    public set size(value) {
        this._size = value;
        mutate(() => {
            this._element.style.width = this._element.style.height = `${value}px`;
            this._element.style.borderWidth = `${value / 2}px`;
        });
    }
}


@Component({
    selector: 'taillight',
    styles: [`
    `],
    template: `
    `
})
export class TailLightComponent extends DisposableComponent {
    private _timer: IDisposable;
    private _element: HTMLElement;
    private _state: boolean[] = _.range(0, 8).map(x => false);
    private _leds: Led[] = [];
    constructor(ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        for (let i = 0; i < this._state.length; i++)
            this._leds.push(new Led(this._element, '#FAF20A'));
    }

    public ngAfterViewChecked() {
        if (!this._timer && this.on) {
            const timer = setInterval(this._animate, 62.5);
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
    public on: boolean = true;
}

@Component({
    selector: 'taillights',
    styles: [`
    `],
    template: `
    <taillight [direction]="'left'"></taillight>
    <taillight [direction]="'right'"></taillight>
    `,
    directives: [TailLightComponent]
})
export class TailLightsControl extends DisposableComponent {
    constructor(
        private lightsensor: LightsensorService,
        private location: LocationService,
        private color: ColorService,
        private ui: UIStateService,
        ref: ElementRef) {
        super();
    }
}



