declare module 'fastdom'{
    export function measure(cb: Function): any;
    export function mutate(cb: Function): any;
    export function clear(caller: any): void;
}
