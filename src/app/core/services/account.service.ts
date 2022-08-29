import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Registration } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AccountService {

    constructor(private http: HttpClient) { }

    registration(data: Registration) {
        console.log(data);
        return this.http.post(`${environment.apiUrl}/users/signup`, data,)
    }

    //forgot-password
    verifyEmail(email: string, code: string) {
        return this.http.patch(`${environment.apiUrl}/users/activate`, { email: email, code: code },)
    }

}