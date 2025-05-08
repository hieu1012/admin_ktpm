import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {

    transform(value: number | string, currencySymbol: string = 'VNĐ'): string {
        if (value == null || value === '') {
            return '0' + currencySymbol;
        }

        const numericValue = typeof value === 'string' ? parseFloat(value) : value;

        return numericValue.toLocaleString('vi-VN') + ' ' + currencySymbol;
    }

}
