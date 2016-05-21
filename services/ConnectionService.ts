import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import _ from 'lodash';

@Injectable()
export class ConnectionService {
    private _online: Observable<boolean>;
    private _currentlyOnline = window.navigator.onLine;

    constructor() {
        this._online = Observable.fromEvent<boolean>(document, 'online')
            .map(x => window.navigator.onLine)
            .do(online => {
                this._currentlyOnline = online;
                console.log('online', online);
            })
            .distinctUntilChanged()
            .share()
            .startWith(true);
    }

    public get online() { return this._online; }
}
