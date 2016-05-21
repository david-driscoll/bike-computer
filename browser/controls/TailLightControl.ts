import {Component} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {TailLightComponent} from './TailLightComponent';
import {StopLightComponent} from './StopLightComponent';

@Component({
    selector: 'taillights',
    styles: [`
    .left {
        position: fixed;
        left: 0;
        top: 0px;
    }

    .right {
        position: fixed;
        right: 0;
        top: 0px;
    }

    stoplight {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        text-align: center;
        z-index: -1;
    }
    `],
    template: `
    <taillight class="left" [direction]="'left'"></taillight>
    <taillight class="right" [direction]="'right'"></taillight>
    <stoplight></stoplight>
    `,
    directives: [TailLightComponent, StopLightComponent]
})
export class TailLightsControl extends DisposableComponent {
    constructor() {
        super();
    }
}



