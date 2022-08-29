import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ViewOptions } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class EmployeeService {

    constructor(private http: HttpClient) { }
    getAll() {
        return this.http.get<any>(`${environment.apiUrl}/v1/employe/load?page=1&size=2`);
    }

    searchEmployee(search: string) {

        return this.http.get<any>(`https://app.swaggerhub.com/apis/strongmoments/Search-Employee-For-Gang-Transfer/1.0.0#/default/post_v1_employee_searchoperatorfromteam
        ?searchKey=${search}`);

    }
}