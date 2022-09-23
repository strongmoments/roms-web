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

    getAllResignationRequest(options: ViewOptions) {
        return this.http.get<any>(`${environment.apiUrl}/v1/resignation/appliedToMe?status=${options.search}&page=${options.page}&size=${options.pageSize}`);
    }


    resignationHistory(options: ViewOptions) {
        return this.http.get<any>(`${environment.apiUrl}/v1/resignation/appliedToMeHistory?page=${options.page}&size=${options.pageSize}`);
    }

    acceptResignation(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/resignation/approve`, data);

    }

    rejectResignation(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/resignation/reject`, data);
    }

    getAllEmployeeResignation(options: ViewOptions, queryData: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/resignation/loadAll?page=${options.page}&size=${options.pageSize}`, queryData);
    }

    searchEmployeeByName(value: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/subteammember/search?name=${value}`);

    }

}