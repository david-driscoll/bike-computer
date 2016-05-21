import {Color} from 'color';
import {mutate} from 'fastdom';

export class Led {
    private _element: HTMLElement;
    private _offColor: string;
    private _offBorder: string;
    private _onColor: string;
    private _onBorder: string;

    constructor(parent: HTMLElement, color: string) {
        this._element = document.createElement('span');
        this._element.style.display = 'inline-block';
        this._element.style.borderStyle = 'solid';
        this.size = this._size;
        this.color = color;

        parent.appendChild(this._element);
    }

    private _on = false;
    public get on() { return this._on; }
    public set on(value) {
        this._on = value;
        mutate(() => {
            this._element.style.borderColor = value ? this._onBorder : this._offBorder;
            this._element.style.backgroundColor = value ? this._onColor : this._offColor;
        });
    }

    private _color: string;
    public get color() { return this._color; }
    public set color(value) {
        this._color = value;
        this._offColor = new Color(this._color).darken(0.32).hexString();
        this._offBorder = new Color(this._color).darken(0.44).hexString();
        this._onColor = new Color(this._color).hexString();
        this._onBorder = new Color(this._color).darken(0.12).hexString();
        this.on = this._on;
    }

    private _size = 8;
    public get size() { return this._size; }
    public set size(value) {
        this._size = value;
        mutate(() => {
            this._element.style.width = this._element.style.height = `${value}px`;
            this._element.style.borderWidth = `${value / 2}px`;
        });
    }
}