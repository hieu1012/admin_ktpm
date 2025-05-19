import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

    // createdAt: "2025-05-19T15:42:09",
    transform(value: string): string {
        if (!value) {
            return '';
        }

        const date = new Date(value);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        return date.toLocaleString('vi-VN', options);
    }


}
