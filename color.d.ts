declare module 'color' {
    export interface RbgColor {
        r: number;
        g: number;
        b: number;
    }
    export interface HslColor {
        h: number;
        s: number;
        l: number;
    }
    export interface HsvColor {
        h: number;
        s: number;
        v: number;
    }
    export interface HwbColor {
        h: number;
        w: number;
        b: number;
    }
    export interface CmykColor {
        c: number;
        m: number;
        y: number;
        k: number;
    }
    export class Color {
        constructor(color?: string);
        constructor(rgb: RbgColor);
        constructor(hsl: HslColor);
        constructor(hsv: HsvColor);
        constructor(hwb: HwbColor);
        constructor(cmyk: CmykColor);

        rgb(): RbgColor;
        hsl(): HslColor;
        hsv(): HsvColor;
        hwb(): HwbColor;
        cmyk(): CmykColor;

        rgbArray(): [number, number, number];
        hslArray(): [number, number, number];
        hsvArray(): [number, number, number];
        hwbArray(): [number, number, number];
        cmykArray(): [number, number, number, number];
        rgbaArray(): [number, number, number, number];
        hslaArray(): [number, number, number, number];

        rgb(r: number, g: number, b: number): Color;
        rgb(rbg: [number, number, number]): Color;
        rgb(rbg: RbgColor): Color;
        hsl(h: number, s: number, l: number): Color;
        hsl(hsl: [number, number, number]): Color;
        hsl(hsl: HslColor): Color;
        hsv(h: number, s: number, v: number): Color;
        hsv(hsv: [number, number, number]): Color;
        hsv(rbg: HsvColor): Color;
        hwb(h: number, w: number, b: number): Color;
        hwb(hwb: [number, number, number]): Color;
        hwb(hwb: HwbColor): Color;
        cmyk(c: number, m: number, y: number, k: number): Color;
        cmyk(cmyk: [number, number, number, number]): Color;
        cmyk(cmyk: CmykColor): Color;

        alpha(): number;
        alpha(alpha: number): Color;
        red(): number;
        red(alpha: number): Color;
        green(): number;
        green(alpha: number): Color;
        blue(): number;
        blue(alpha: number): Color;
        hue(): number;
        hue(alpha: number): Color;
        saturation(): number;
        saturation(alpha: number): Color;
        lightness(): number;
        lightness(alpha: number): Color;
        saturationv(): number;
        saturationv(alpha: number): Color;
        whiteness(): number;
        whiteness(alpha: number): Color;
        blackness(): number;
        blackness(alpha: number): Color;
        value(): number;
        value(alpha: number): Color;
        cyan(): number;
        cyan(alpha: number): Color;
        magenta(): number;
        magenta(alpha: number): Color;
        yellow(): number;
        yellow(alpha: number): Color;
        black(): number;
        black(alpha: number): Color;

        hexString(): string;
        rgbString(): string;
        rgbaString(): string;
        percentString(): string;
        hslString(): string;
        hslaString(): string;
        hwbString(): string;
        keyword(): string;

        rgbNumber(): number;

        luminosity(): number;
        contrast(color2: Color): number;
        level(): string;
        dark(): boolean;
        light(): boolean;
        negate(): Color;
        lighten(ratio: number): Color;
        darken(ratio: number): Color;
        saturate(ratio: number): Color;
        desaturate(ratio: number): Color;
        whiten(ratio: number): Color;
        blacken(ratio: number): Color;
        greyscale(ratio: number): Color;
        clearer(ratio: number): Color;
        opaquer(ratio: number): Color;
        rotate(degrees: number): Color;

        mix(mixinColor: Color, weight: number): Color;
        clone(): Color;
    }
}
