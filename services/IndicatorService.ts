import {Observable} from 'rxjs';
import _ from 'lodash';
import {Injectable} from '@angular/core';

export enum Signal {
    Left,
    Right,
    Stop
}

export class SignalContext {
    constructor(public signal: Signal, public state: boolean) { }
}

@Injectable()
export class IndicatorService {
    private _signals: Observable<SignalContext>;
    private _left: Observable<boolean>;
    private _right: Observable<boolean>;
    private _stop: Observable<boolean>;

    constructor() {
        this._signals = Observable.interval(1000)
            .map(() => <Signal>_.random(0, 2))
            .map(signal => new SignalContext(signal, !!_.random(0, 1)))
            .share();

        this._left = this._signals
            .filter(x => x.signal === Signal.Left)
            .map(x => x.state)
            .share();

        this._right = this._signals
            .filter(x => x.signal === Signal.Right)
            .map(x => x.state)
            .share();

        this._stop = this._signals
            .filter(x => x.signal === Signal.Stop)
            .map(x => x.state)
            .share();
    }

    public get signals() { return this._signals; }
    public get leftTurn() { return this._left; }
    public get rightTurn() { return this._right; }
    public get stop() { return this._stop; }
}
