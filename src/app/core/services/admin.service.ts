import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Company, UserAuth, ViewOptions } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AdminService {

    constructor(private http: HttpClient) { }

    /* company */
    companySave(data: Company) {
        if (data.id === null || data.id === undefined) {
            return this.http.post(`${environment.apiUrl}/company`, data,)
        } else {
            return this.http.post(`${environment.apiUrl}/company/${data.id}`, data,)
        }
    }
    companyGetAll() {
        return this.http.get<Company[]>(`${environment.apiUrl}/company/all`);
    }
    companySearch(options: ViewOptions) {
        return this.http.get<Company[]>(`${environment.apiUrl}/company/search?page=${options.page}&size=${options.pageSize}&key=${options.search}&sort=${options.sortField}&direction=${options.sortDirection}`);
    }

    companyUpdate(id: number, data: Company) {
        return this.http.put(`${environment.apiUrl}/company/${id}`, data,)
    }

    companyRemove(id: string) {
        return this.http.delete(`${environment.apiUrl}/company/${id}`);
    }
    /* USER */
    userSave(data: UserAuth) {
        if (data.id === null || data.id === undefined) {
            return this.http.post(`${environment.apiUrl}/users`, data,)
        } else {
            return this.http.post(`${environment.apiUrl}/users/${data.id}`, data,)
        }
    }
    userSearch(options: ViewOptions) {
        return this.http.get<Company[]>(`${environment.apiUrl}/users/search?page=${options.page}&size=${options.pageSize}&key=${options.search}&sort=${options.sortField}&direction=${options.sortDirection}`);
    }
    userRemove(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
}