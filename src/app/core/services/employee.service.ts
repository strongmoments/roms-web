import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ViewOptions } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class EmployeeService {

    constructor(private http: HttpClient) { }
    getAll(options: ViewOptions) {
        return this.http.get<any>(`${environment.apiUrl}/v1/employee/load?page=${options.page}&size=${options.pageSize}&${options.query}`);
    }


    uploadPicture(data: any) {
        // let headers = new HttpHeaders();
        // headers.set('content-type', 'multipart/form-data');
        return this.http.post<any>(`${environment.apiUrl}/v1/employee/uploadpic`, data);
    }

    getById(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/employee/load/${id}`);
    }


    getByIdPersonalInfo(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/employee/personalinfo/${id}`);
    }


    searchEmployee(search: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/subteammember/search?name=${search}`);
    }
    
    searchGang(search: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/projectsubteam/search?name=${search}`);
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


    employeeOnboardList(options: ViewOptions) {
        return this.http.get<any>(`${environment.apiUrl}/v1/employee/onboard/loadAll?page=${options.page}&size=${options.pageSize}`);
    }




    getAllEmployeeResignation(options: ViewOptions, queryData: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/resignation/loadAll?page=${options.page}&size=${options.pageSize}`, queryData);
    }

    searchEmployeeByName(value: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/subteammember/search?name=${value}`);
    }

    searchEmployeeForJobDemand(value: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/employee/load?page-0&size=800&empName=${value}`);
    }
    searchEmployeeUnderManager(value: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/employee/load/own?empName=${value}`);
    }

    getEmployeeGangDetails(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/subteammember/${id}`);
    }

    resetPasswordById(employeeId: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/password/reset/${employeeId}`);
    }

    recommendEmployee(param:any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/jobs/resource/demand/recommend`, param);
    }

}