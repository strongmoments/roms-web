import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class Utils {
    websiteRegex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/
    emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    numericRegex = /^[0-9]\d{0,9}(\.\d{1,3})?%?$/;
    passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    usZipCode = /^\d{5}(\-\d{4})?$/;
    usPhone = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
    usPhoneWithCode = /^\+1 (\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
    intRegex = /^[0-9]*$/;
    mmYY = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    mmYYYY = /^(0[1-9]|1[0-2])\/([0-9]{4})$/;

    phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    extensionMask = [/\d/, /\d/, /\d/, /\d/];
    phoneCountryCodeMask = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    cvv = [/\d/, /\d/, /\d/, /\d/];
    monthYear = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    fieldLength = { firstName: { min: 2, max: 30 }, lastName: { min: 2, max: 30 } };

}