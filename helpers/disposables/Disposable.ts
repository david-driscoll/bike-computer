export interface IDisposable {
    dispose(): void;
}

export interface ISubscription {
    unsubscribe(): void;
}

export function isDisposable(value: any): value is IDisposable {
    return value.dispose;
}
export function isSubscription(value: any): value is ISubscription {
    return value.unsubscribe;
}

export type IDisposableOrSubscription = IDisposable | ISubscription | (() => void);
let empty: Disposable;

export class Disposable implements IDisposable {
    public static get empty() { return empty; }

    public static of(value: IDisposableOrSubscription) {
        if (!value) return empty;

        if (isDisposable(value)) {
            return <IDisposable>value;
        }
        return new Disposable(value);
    }

    public static create(action: () => void) {
        return new Disposable(action);
    }

    private _action: () => void;
    private _isDisposed = false;

    constructor(value: IDisposableOrSubscription);
    constructor(value: any) {
        if (!value) return empty;

        if (typeof value === "function") {
            this._action = value;
        } else if (value.unsubscribe) {
            this._action = () => (<ISubscription>value).unsubscribe();
        } else if (value.dispose) {
            this._action = () => (<IDisposable>value).dispose();
        }
    }

    public get isDisposed() { return this._isDisposed; }

    public dispose() {
        if (!this.isDisposed) {
            this._isDisposed = true;
            this._action();
        }
    }
}

empty = new Disposable(function noop() { /* */ });
