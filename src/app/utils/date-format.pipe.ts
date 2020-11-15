import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

    transform(value: Date, ...args: unknown[]): string {
        return this.formatDay(value.getDay()) + ' '
            + this.formatNum(value.getDate()) + '/'
            + this.formatNum(value.getMonth()+1) + '/'
            + this.formatNum(value.getFullYear()) + ' '
            + this.formatNum(value.getHours()) + ':'
            + this.formatNum(value.getUTCMinutes()) + 'hs';
    }
    private formatNum(num: number): string {
        if (num < 10) {
            return '0' + num
        }
        return num.toString()
    }
    private formatDay(dayIndex: number): string {
        return ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"][dayIndex]
    }
}
