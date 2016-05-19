import {ComponentMetadata, InjectableMetadata} from '@angular/core';
import _ from 'lodash';
import {readdirSync} from 'fs';
import {join, basename, extname} from 'path';

export function loadComponents(req: Function, ...paths: string[]) {
    const path = join(...paths);
    const items: any[] = [];

    const filteredFiles = _(readdirSync(path))
        .filter(x => x.endsWith('.ts'))
        .map(x => basename(x, extname(x)));

    for (let item of filteredFiles) {
        const module = req(join(path, item));

        for (let exp of _.values(module)) {
            const annotations = Reflect.getMetadata('annotations', exp);
            if (_.some(annotations, a => a instanceof ComponentMetadata)) {
                items.push(exp);
            }
        }
    }

    return items;
}

export function loadInjectables(req: Function, ...paths: string[]) {
    const path = join(...paths);
    const items: any[] = [];

    const filteredFiles = _(readdirSync(path))
        .filter(x => x.endsWith('.ts'))
        .map(x => basename(x, extname(x)));

    for (let item of filteredFiles) {
        const module = req(join(path, item));

        for (let exp of _.values(module)) {
            const annotations = Reflect.getMetadata('annotations', exp);
            if (_.some(annotations, a => a instanceof InjectableMetadata)) {
                items.push(exp);
            }
        }
    }

    return items;
}
