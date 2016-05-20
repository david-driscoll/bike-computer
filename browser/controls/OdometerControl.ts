import {Component, ElementRef} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {LightsensorService} from '../../services/LightsensorService';
import {DistanceService} from '../../services/DistanceService';
import {ColorService} from '../../services/ColorService';
import {LocationService} from '../../services/LocationService';

@Component({
    selector: 'odometer',
    styles: [`
        .text {
            color: white;
        }

        .day :host .text {
            color: black;
        }

        .compass {
            transition: all 0.5s ease;
            font-size: 40px;
            font-weight: bold;
            position: absolute;
            bottom: 75%;
            margin-right: -30%;
            margin-bottom: -22px;
            width: 100%;
            text-align: center;
        }

        .trip {
            transition: all 0.5s ease;
            font-size: 36px;
            border-top: 2px solid white;
            position: absolute;
            bottom: 50%;
            margin-right: -30%;
            margin-bottom: -22px;
            width: 100%;
            text-align: center;
        }

        .odometer {
            transition: all 0.5s ease;
            border-top: 2px solid white;
            font-size: 20px;
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
            width: 156px;
            height: 156px;
        }

        .day :host {
            border-color: black;
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
        ref: ElementRef) {
        super();
        this._element = ref.nativeElement;
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();

        const compass = this._compass = <HTMLElement>this._element.querySelector('.compass');
        const trip = this._trip = <HTMLElement>this._element.querySelector('.trip');
        const odometer = this._odometer = <HTMLElement>this._element.querySelector('.odometer');

        this._disposable.add(
            this.distance.trip
                .subscribe(distance => trip.innerText = _.padStart(distance.toFixed(1), 5, '0')),
            this.distance.odometer
                .subscribe(distance => odometer.innerText = _.padStart(distance.toFixed(1), 8, '0')),
            this.location.speed
                .subscribe(speed => this._updateSpeed(speed)),
            this.location.heading
                .map(degree => this.location.compass(degree))
                .distinctUntilChanged()
                .subscribe(heading => compass.innerText = heading)
        );

    }

    private _updateSpeed(speed: number) {
        this._element.style.boxShadow = `0 0 0 10px ${this.color.getColorForSpeed(speed)}, 0 0 0 20px ${this.color.getColorForSpeed(speed + 2.5)}`;

        const speedLessOne = this.color.getColorForSpeed(speed - 2.5);
        this._element.style.borderColor = speedLessOne;
        this._odometer.style.borderTopColor = speedLessOne;
        this._trip.style.borderTopColor = speedLessOne;
    }
}
