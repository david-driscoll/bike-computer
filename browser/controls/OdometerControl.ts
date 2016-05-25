import {Component, ElementRef} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {LightsensorService} from '../../services/LightsensorService';
import {DistanceService} from '../../services/DistanceService';
import {ColorService} from '../../services/ColorService';
import {LocationService} from '../../services/LocationService';
import {UIStateService, UIState} from '../services/UIStateService';

const controlSize = 156;
const odometerFont = 20;
const tripFont = 36;
const compassFont = 40;

@Component({
    selector: 'odometer',
    styles: [`
        .text {
            color: gold;
        }

        .day :host .text {
            color: black;
        }

        .compass {
            transition: all 0.5s ease;
            font-size: ${tripFont}px;
            font-weight: bold;
            position: absolute;
            bottom: 80%;
            margin-right: -30%;
            margin-bottom: -22px;
            width: 100%;
            text-align: center;
        }

        .trip {
            transition: all 0.5s ease;
            font-size: ${odometerFont}px;
            border-top: 2px solid white;
            position: absolute;
            bottom: 50%;
            margin-right: -30%;
            margin-bottom: -22px;
            width: 100%;
            text-align: center;
        }

        .day :host .trip {
            border-top-color: black;
        }

        .odometer {
            transition: all 0.5s ease;
            border-top: 2px solid white;
            font-size: ${odometerFont}px;
            position: absolute;
            bottom: 30px;
            width: 100%;
            text-align: center;
        }

        .day :host .odometer {
            border-top-color: black;
        }

        :host {
            transition: all 0.5s ease;
            box-shadow: 0 0 0 10px hsl(0, 0%, 80%), 0 0 0 20px hsl(0, 0%, 90%);
            border: 10px solid white;
            border-radius: 200px;
            border-bottom-right-radius: 0;
            position: fixed;
            bottom: -38px;
            right: -17px;
            width: ${controlSize}px;
            height: ${controlSize}px;
            z-index: 1000;
            background-color: black;
        }

        .day :host {
            border-color: black;
            background-color: white;
        }
    `],
    template: `
    <div class="compass text"></div>
    <div class="trip text"></div>
    <div class="odometer text"></div>
    `
})
export class OdometerControl extends DisposableComponent {
    private _element: HTMLElement;
    private _compass: HTMLElement;
    private _trip: HTMLElement;
    private _odometer: HTMLElement;

    constructor(
        private lightsensor: LightsensorService,
        private distance: DistanceService,
        private location: LocationService,
        private color: ColorService,
        private ui: UIStateService,
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();

        const compass = this._compass = <HTMLElement>this._element.querySelector('.compass');
        const trip = this._trip = <HTMLElement>this._element.querySelector('.trip');
        const odometer = this._odometer = <HTMLElement>this._element.querySelector('.odometer');

        this._element.style.width = `${controlSize}px`;
        this._element.style.height = `${controlSize}px`;

        this._disposable.add(
            this.distance.trip
                .map(distance => _.padStart(distance.toFixed(1), 5, '0'))
                .distinctUntilChanged()
                .subscribe(distance => trip.innerText = distance),
            this.distance.odometer
                .map(distance => _.padStart(distance.toFixed(1), 8, '0'))
                .distinctUntilChanged()
                .subscribe(distance => odometer.innerText = distance),
            this.location.speed
                .auditTime(1000/3)
                .subscribe(speed => this._updateSpeed(speed)),
            this.location.facing
                .map(degree => this.location.compass(degree))
                .distinctUntilChanged()
                .subscribe(heading => compass.innerText = heading),
            this.ui.state.subscribe(state => this._updateState(state))
        );

    }

    private _updateSpeed(speed: number) {
        this._element.style.boxShadow = `0 0 0 10px ${this.color.getColorForSpeed(speed)}, 0 0 0 20px ${this.color.getColorForSpeed(speed + 2.5)}`;

        const speedLessOne = this.color.getColorForSpeed(speed - 2.5);
        this._element.style.borderColor = speedLessOne;
        this._odometer.style.borderTopColor = speedLessOne;
        this._trip.style.borderTopColor = speedLessOne;
    }

    public _updateState(state: UIState) {
        if (state === UIState.Zoom) {
            this._element.style.width = `${controlSize * 2}px`;
            this._element.style.height = `${controlSize * 2}px`;
            this._compass.style.fontSize = `${compassFont * 2}px`;
            this._compass.style.bottom = '70%';
            this._odometer.style.fontSize = `${odometerFont * 2}px`;
            this._odometer.style.bottom = '50px';
            this._trip.style.fontSize = `${tripFont * 2}px`;
            this._trip.style.bottom = '40%';
        } else {
            this._element.style.width = `${controlSize}px`;
            this._element.style.height = `${controlSize}px`;
            this._compass.style.fontSize = `${compassFont}px`;
            this._compass.style.bottom = '80%';
            this._odometer.style.fontSize = `${odometerFont}px`;
            this._odometer.style.bottom = '30px';
            this._trip.style.fontSize = `${tripFont}px`;
            this._trip.style.bottom = '50%';
        }
    }
}
