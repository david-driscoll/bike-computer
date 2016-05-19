import {Disposable} from '../helpers/disposables';

export function style(styleText: string) {

    const style = document.createElement('style');
    style.innerText = styleText;
    document.head.appendChild(style);

    return Disposable.create(() => document.head.removeChild(style));
}
