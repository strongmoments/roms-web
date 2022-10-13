import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ViewOptions } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class LeaveService {

    constructor(private http: HttpClient) { }

    getLeaveTypes() {
        // return this.http.get<any>('https://virtserver.swaggerhub.com/strongmoments/leave-type/1.0.0/v1/leave/types');
        return this.http.get<any>(`${environment.apiUrl}/v1/leave/types`);
    }

    applyLeave(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/leave/request`, data);
    }

    myLeaveHistory(options: ViewOptions) {
        return this.http.get<any>(`${environment.apiUrl}/v1/leave/applied?page=${options.page}&size=${options.pageSize}`);
    }

    staffLeavePending(options: ViewOptions) {
        return this.http.get<any>(`${environment.apiUrl}/v1/leave/appliedToMe?leaveStatus=${options.search}&page=${options.page}&size=${options.pageSize}`);
    }

    staffLeaveHistory(options: ViewOptions) {
        return this.http.get<any>(`${environment.apiUrl}/v1/leave/appliedToMeHistory?page=${options.page}&size=${options.pageSize}`);
    }


    approveLeave(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/leave/approve`, data);

    }

    rejectLeave(data: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/leave/reject`, data);
    }

    getManager() {
        return this.http.get<any>(`${environment.apiUrl}/v1/leave/approver`);
    }


    getAllEmployeeLeaves(options: ViewOptions, queryData: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/leave/loadAll?page=${options.page}&size=${options.pageSize}`, queryData);
    }

    getAllEmployeeLeavesCurrent(options: ViewOptions, queryData: any) {
        return this.http.post<any>(`${environment.apiUrl}/v1/leave/loadCurrent?page=${options.page}&size=${options.pageSize}`, queryData);
    }

    uploadAttachment(data: any) {
        // let headers = new HttpHeaders();
        // headers.set('content-type', 'multipart/form-data');
        return this.http.post<any>(`${environment.apiUrl}/v1/leave/uploaddoc`, data, {
            
        });
    }



}