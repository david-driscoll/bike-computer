import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConnectionService} from '../../services/ConnectionService';

export enum UIState {
    Zoom,
    Maps,
    Camera
}

@Injectable()
export class UIStateService {
    private _state: Observable<UIState>;
    constructor(connection: ConnectionService) {
        this._state = connection.online
            .map(x => {
                if (x) {
                    return UIState.Maps;
                }
                return UIState.Zoom;
            })
            .distinctUntilChanged()
            .cache(1);
    }

    public get state() { return this._state; }
}
