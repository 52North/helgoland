import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: Array<any> | undefined, field: string): any {
    if (value != undefined && value.length && field != undefined) {
      value.sort((a, b) => {
        const valA = (a[field] as string).toLowerCase();
        const valB = (b[field] as string).toLowerCase();
        if (valA < valB) {
          return -1;
        } else if (valA > valB) {
          return 1;
        } else {
          return 0;
        }
      })
    }
    return value;
  }

}
