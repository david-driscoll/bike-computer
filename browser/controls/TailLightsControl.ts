import {Component} from '@angular/core';
import _ from 'lodash';
import {DisposableComponent} from '../../helpers/disposables';
import {TailLightControl} from './TailLightControl';
import {StopLightControl} from './StopLightControl';

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
        z-index: 1000;
    }

    taillight {
        z-index: 1001;
    }
    `],
    template: `
    <taillight class="left" [direction]="'left'"></taillight>
    <taillight class="right" [direction]="'right'"></taillight>
    <stoplight></stoplight>
    `,
    directives: [TailLightControl, StopLightControl]
})
export class TailLightsControl extends DisposableComponent {
    constructor() {
        super();
    }
}



