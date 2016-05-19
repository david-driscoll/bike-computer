import {Component} from '@angular/core';
import {loadComponents, loadInjectables} from '../helpers/serviceLoading';

@Component({
    selector: 'bike-computer',
    providers: loadInjectables(require, __dirname, '../services'),
    directives: loadComponents(require, __dirname, 'controls'),
    template: `
        <speedo></speedo>
`
})
export class BikeComputerComponent {

}
