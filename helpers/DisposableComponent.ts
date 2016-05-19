import {OnInit, OnDestroy, AfterContentInit, AfterViewInit} from '@angular/core';
import {CompositeDisposable} from './disposables/CompositeDisposable';

export abstract class DisposableComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {
    protected _disposable = new CompositeDisposable();
    constructor() { /* */ }

    public ngOnInit() { /* */ }
    public ngOnDestroy() {
        this._disposable.dispose();
    }

    public ngAfterContentInit() { /* */ }
    public ngAfterViewInit() { /* */ }
}
