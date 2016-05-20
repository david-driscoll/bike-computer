declare module 'angles' {
    interface Angles {
        SCALE: number;
        normalizeHalf(n: number): number;
        normalize(n: number): number;
        shortestDirection(from: number, to: number): number;
        between(n: number, a: number, b: number): boolean;
        diff(a: number, b: number): number;
        lerp(a: number, b: number, p: number, dir?: number): number;
        distance(a: number, b: number): number;
        toRad(n: number): number;
        toDeg(n: number): number;
        toGon(n: number): number;
        fromSlope(p1: [number, number], p2: [number, number]): number;
        fromSinCos(sin: number, cos: number): number;
        quadrant(x: number, y: number, k?: number, shift?: number): number;
        compass(angle: number): string;
    }

    var angles: Angles;

    export default angles;
}
