import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): Array<any> {
        const keys = [];
        for (const key in value) {
            if (value.hasOwnProperty(key))
                keys.push({ key, value: value[key] });
        }
        return keys;
    }
}
