import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import _ from 'lodash';
import {DisposableComponent} from '../helpers/disposables';
import {loadComponents, loadInjectables} from '../helpers/serviceLoading';
import {LightsensorService, TimeOfDay} from '../services/LightsensorService';
import {UIStateService, UIState} from './services/UIStateService';

@Component({
    selector: 'bike-computer',
    providers: loadInjectables(require, __dirname, '../services').concat(loadInjectables(require, __dirname, 'services')).concat(HTTP_PROVIDERS),
    directives: loadComponents(require, __dirname, 'controls'),
    template: `
        <speedo></speedo>
        <odometer></odometer>
        <taillights></taillights>
        <mapbox *ngIf="(ui.state | async) === ${UIState.Maps}"></mapbox>
        <open-weather></open-weather>
`
})
export class BikeComputerComponent extends DisposableComponent {
    constructor(lightsensor: LightsensorService, private ui: UIStateService) {
        super();
        this._disposable.add(lightsensor.timeOfDay
            .subscribe(timeOfDay => {
                _(_.keys(TimeOfDay))
                    .filter(_.isString)
                    .map(_.toLower)
                    .each(x => document.body.classList.remove(x));
                document.body.classList.add(TimeOfDay[timeOfDay].toLowerCase());

                if (timeOfDay === TimeOfDay.Day) {
                    document.body.style.backgroundColor = 'white';

                    const links = document.head.querySelectorAll('link');
                    const link = _.find(links, (link: HTMLLinkElement) => link.href.endsWith('kendo.metroblack.min.css'));
                    if (link) {
                        const newLink = document.createElement('link');
                        newLink.rel = 'stylesheet';
                        newLink.href = './vendor/kendo/styles/kendo.metro.min.css';
                        document.head.removeChild(link);
                        document.head.appendChild(newLink);
                    }
                } else {
                    document.body.style.backgroundColor = 'black';
                    const links = document.head.querySelectorAll('link');
                    const link = _.find(links, (link: HTMLLinkElement) => link.href.endsWith('kendo.metro.min.css'));
                    if (link) {
                        const newLink = document.createElement('link');
                        newLink.rel = 'stylesheet';
                        newLink.href = './vendor/kendo/styles/kendo.metroblack.min.css';
                        document.head.removeChild(link);
                        document.head.appendChild(newLink);
                    }
                }
            }));
    }
}
