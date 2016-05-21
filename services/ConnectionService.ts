import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import _ from 'lodash';
const isOnline = Observable.bindNodeCallback(<(cb: (err: any, online: boolean) => void) => void>require('is-online'));

@Injectable()
export class ConnectionService {
    private _online: Observable<boolean>;
    private _currentlyOnline: boolean;

    constructor() {
        this._online = isOnline()
            .expand(online => {
                if (online) return Observable.timer(1000 * 60 * 5).mergeMap(isOnline);
                return Observable.timer(1000 * 60 * 1).mergeMap(isOnline);
            })
            .do(online => this._currentlyOnline = online)
            .share()
            .startWith(this._currentlyOnline);
    }

    public get online() { return this._online; }
}
