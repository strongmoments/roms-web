import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from "@angular/common";

@Pipe({
    name: 'datePipeJava'
})


export class CustomJavaDatePipe extends DatePipe implements PipeTransform {

    override transform(value: any, format: string = ''): any {
        if (!value) return;
        try {
            let date = new Date(value * 1000);
            if (!date) {
                return;
            }
            if (format) {
                return super.transform(date, format);
            }
            return super.transform(date);
        } catch (e) {
            return '';
        }
    }
}