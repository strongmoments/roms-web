import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'base64Image'
})


export class Base64ImagePipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) { }

    transform(value: any, args?: any): SafeUrl {
        // let Base64 = value;
        let objectURL = 'data:image/png;base64,' + value;


        // console.log(value,'value')
        if (typeof (value) != 'undefined' && value) {
            return this.domSanitizer.bypassSecurityTrustUrl(objectURL);
        } else {
            return '';
        }
    }
}
