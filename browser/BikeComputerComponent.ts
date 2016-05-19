import {Component} from '@angular/core';
import {loadComponents, loadInjectables} from './helpers';
import {PhotodetectorService} from '../services/PhotodetectorService';

@Component({
    selector: 'bike-computer',
    providers: [PhotodetectorService],
    directives: loadComponents(require, __dirname, 'controls'),
    template: `
        <speedo></speedo>
`
})
export class BikeComputerComponent {

}
