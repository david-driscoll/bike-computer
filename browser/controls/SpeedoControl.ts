import {Component, ElementRef} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {PhotodetectorService, TimeOfDay} from '../../services/PhotodetectorService';
import {AccelerationService} from '../../services/AccelerationService';

@Component({
    selector: 'speedo',
    styles: [`
        .gauge {
            position: fixed !important;
            left: -17px;
            bottom: -27px;
        }
        .speed {
            font: bold 24px "Roboto";
            color: white;
            position: fixed !important;
            right: 680px;
            bottom: 10px;
        }
        .day :host .speed {
            color: black;
        }
    `],
    template: `
    <div class="gauge"></div>
    <div class="speed">
        <span class="speed-value">0.0</span>mph
    </div>
    `
})
export class SpeedoControl extends DisposableComponent {
    private static majorUnit = 5;
    private _element: HTMLElement;
    private _speedElement: HTMLElement;
    private _gauge: kendo.dataviz.ui.RadialGauge;

    constructor(
        private photodetector: PhotodetectorService,
        private acceleration: AccelerationService,
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();

        this._speedElement = <any>this._element.querySelector('.speed-value');

        const element = $(this._element.querySelector('.gauge')).kendoRadialGauge({
            name: 'speedo',
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
                max: this.acceleration.maxSpeed,
                reverse: true,
                labels: {
                    position: 'inside',
                    font: 'bold 18px "Roboto"',
                    color: '#CC2EFA'
                },
                rangePlaceholderColor: 'white',
                rangeSize: 12,
                ranges: this.acceleration.getColors()
                    .map((color, index) => {
                        return {
                            color,
                            from: index,
                            to: index + 1,
                            opacity: 0.8
                        };
                    })
            }
        });

        this._gauge = element.data('kendoRadialGauge');
        this._updateSpeed(0);
        this._disposable.add(
            () => this._gauge.destroy(),
            this.acceleration.speed.subscribe(speed => this._updateSpeed(speed)),
            this.acceleration.speed
                .map(speed => _.floor(speed / SpeedoControl.majorUnit))
                .distinctUntilChanged()
                .auditTime(2000)
                .startWith(0)
                .subscribe(speed => this._updateScale(speed)),
            this.photodetector.timeOfDay.subscribe(timeOfDay => this._updateSkin(timeOfDay))
        );

    }

    public ngOnInit() {
        super.ngOnInit();
    }

    public _updateSpeed(speed: number) {
        this._gauge.allValues([speed]);
        this._speedElement.innerText = <any>speed.toFixed(1);
    }

    private _updateRanges() {
        this._gauge.options.scale.ranges = this.acceleration.getColors()
            .map((color, index) => {
                return {
                    color,
                    from: index,
                    to: index + 1,
                    opacity: 0.8
                };
            });
    }

    private _updateScale(scale: number) {
        this._gauge.options.scale.max = _.clamp((scale + 2) * SpeedoControl.majorUnit, SpeedoControl.maxScale);
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
        this._redraw();
    }
}



