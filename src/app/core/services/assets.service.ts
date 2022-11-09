import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ViewOptions } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AssetsService {

    constructor(private http: HttpClient) { }
    getAll(options: ViewOptions) {
        // console.log();
        return this.http.get<any>(`${environment.apiUrl}/v1/assets?page=${options.page}&size=${options.pageSize}&${options.query}`);
    }

    save(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/assets`, data);
    }
}