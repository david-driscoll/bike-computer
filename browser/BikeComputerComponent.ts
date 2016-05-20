import {Component} from '@angular/core';
import _ from "lodash";
import {DisposableComponent} from '../helpers/disposables';
import {loadComponents, loadInjectables} from '../helpers/serviceLoading';
import {PhotodetectorService, TimeOfDay} from '../services/PhotodetectorService';

@Component({
    selector: 'bike-computer',
    providers: loadInjectables(require, __dirname, '../services'),
    directives: loadComponents(require, __dirname, 'controls'),
    template: `
        <speedo></speedo>
        <odometer></odometer>
`
})
export class BikeComputerComponent extends DisposableComponent {
    constructor(photodetector: PhotodetectorService) {
        super();
        this._disposable.add(photodetector.timeOfDay
            .subscribe(timeOfDay => {
                _.each(TimeOfDay, (x: number) => _.isNumber(x) && document.body.classList.remove(TimeOfDay[x].toLowerCase()));
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
