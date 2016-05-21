import {Component, ElementRef} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {LightsensorService, TimeOfDay} from '../../services/LightsensorService';
import {LocationService} from '../../services/LocationService';
import {ColorService} from '../../services/ColorService';
import {UIStateService, UIState} from '../services/UIStateService';

@Component({
    selector: 'speedo',
    styles: [`
        .gauge {
            transition: all 0.5s ease;
            position: fixed !important;
            left: -17px;
            bottom: -27px;
            z-index: 1001;
        }
        .speed {
            transition: all 0.5s ease;
            font: bold 24px "Roboto";
            color: white;
            position: fixed !important;
            right: 680px;
            bottom: 10px;
            transition: all 0.5s ease;
            z-index: 1001;
        }
        .day :host .speed {
            color: black;
        }
        .gauge-back {
            position: fixed;
            border-radius: 400px;
            border-bottom-left-radius: 0;
            left: -13px;
            bottom: -33px;
            width: 178px;
            height: 178px;
            background-color: black;
            z-index: 1000;
        }
        .day :host .gauge-back {
            background-color: white;
        }
    `],
    template: `
    <div class="gauge"></div>
    <div class="gauge-back"></div>
    <div class="speed">
        <span class="speed-value">0.0</span>mph
    </div>
    `
})
export class SpeedoControl extends DisposableComponent {
    private static majorUnit = 5;
    private _element: HTMLElement;
    private _speed: HTMLElement;
    private _gauge: kendo.dataviz.ui.RadialGauge;

    constructor(
        private lightsensor: LightsensorService,
        private location: LocationService,
        private color: ColorService,
        private ui: UIStateService,
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();

        this._speed = <any>this._element.querySelector('.speed-value');

        const element = $(this._element.querySelector('.gauge')).kendoRadialGauge({
            name: 'speedo',
            gaugeArea: {
                height: 200,
                width: 200
            },
            pointer: [
                {
                    color: 'white',
                    value: 10,
                    cap: {
                        size: 0.15
                    }
                }
            ],
            scale: {
                startAngle: 30,
                endAngle: 220,
                minorUnit: 0.5,
                majorUnit: SpeedoControl.majorUnit,
                minorTicks: {
                    width: 1,
                    color: 'white'
                },
                majorTicks: {
                    width: 4,
                    size: 20,
                    color: 'white'
                },
                min: 0,
                max: this.location.maxSpeed,
                reverse: true,
                labels: {
                    position: 'inside',
                    font: 'bold 18px "Roboto"',
                    color: '#CC2EFA'
                },
                rangePlaceholderColor: 'white',
                rangeSize: 12,
                ranges: []
            }
        });

        this._gauge = element.data('kendoRadialGauge');
        this._updateSpeed(0);
        this._disposable.add(
            () => this._gauge.destroy(),
            this.location.speed.subscribe(speed => this._updateSpeed(speed)),
            this.location.speed
                .map(speed => _.floor(speed / SpeedoControl.majorUnit))
                .distinctUntilChanged()
                .auditTime(2000)
                .startWith(0)
                .subscribe(speed => this._updateScale(speed)),
            this.lightsensor.timeOfDay.subscribe(timeOfDay => this._updateSkin(timeOfDay)),
            this.ui.state.subscribe(state => this._updateState(state))
        );

    }

    public ngOnInit() {
        super.ngOnInit();
    }

    public _updateSpeed(speed: number) {
        this._gauge.allValues([speed]);
        this._speed.innerText = <any>speed.toFixed(1);
    }

    private _updateRanges() {
        this._gauge.options.scale.ranges = _.range(0, 31, 1)
            .map(speed => {
                return {
                    color: this.color.getColorForSpeed(speed),
                    from: speed,
                    to: speed + 1,
                    opacity: 0.8
                };
            });
    }

    private _updateScale(scale: number) {
        this._gauge.options.scale.max = _.clamp((scale + 2) * SpeedoControl.majorUnit, this.location.maxSpeed);
        this._updateRanges();
        this._redraw();
    }

    private _redraw() {
        this._gauge.options.transitions = false;
        this._gauge.redraw();
        this._gauge.options.transitions = true;
    }

    public _updateSkin(timeOfDay: TimeOfDay) {
        const gauge = this._gauge.options;
        if (timeOfDay === TimeOfDay.Day) {
            gauge.pointer[0].color = 'black';
            gauge.scale.minorTicks.color = 'black';
            gauge.scale.majorTicks.color = 'black';
            gauge.scale.labels.color = '#CC2EFA';
            gauge.scale.rangePlaceholderColor = 'black';
        } else {
            gauge.pointer[0].color = 'white';
            gauge.scale.minorTicks.color = 'white';
            gauge.scale.majorTicks.color = 'white';
            gauge.scale.labels.color = '#CC2EFA';
            gauge.scale.rangePlaceholderColor = 'white';
        }
        this._gauge.setOptions(gauge);
        this._updateRanges();
        this._redraw();
    }

    public _updateState(state: UIState) {
        if (state === UIState.Zoom) {
            this._gauge.options.gaugeArea.height = 388;
            this._gauge.options.gaugeArea.width = 388;
            this._gauge.element[0].style.bottom = '-47px';
            this._gauge.element[0].style.left = '-29px';
            this._gauge.options.scale.minorTicks.width = 2;
            this._gauge.options.scale.rangeSize = 24;
            this._gauge.options.scale.labels.font = 'bold 32px "Roboto"';
            this._speed.parentElement.style.fontSize = '48px';
            this._speed.parentElement.style.right = '580px';
        } else {
            this._gauge.options.gaugeArea.height = 200;
            this._gauge.options.gaugeArea.width = 200;
            this._gauge.element[0].style.bottom = '-27px';
            this._gauge.element[0].style.left = '-17px';
            this._gauge.options.scale.minorTicks.width = 1;
            this._gauge.options.scale.rangeSize = 12;
            this._gauge.options.scale.labels.font = 'bold 18px "Roboto"';
            this._speed.parentElement.style.fontSize = '24px';
            this._speed.parentElement.style.right = '680px';
        }
        this._gauge.setOptions(this._gauge.options);
        this._updateRanges();
        this._redraw();
    }
}



