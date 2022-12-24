import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewOptions } from 'src/app/_models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class JobService {
  constructor(private http: HttpClient) {}
  getAllResourceDemand() {
    return this.http.get<any>(`${environment.apiUrl}/v1/jobs/resource/demand`);
  }

  getDemandDetails(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/v1/jobs/resource/demand/${id}`);
  }

  getAllMyResourceDemand(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/v1/jobs/resource/demand/mydemand/${id}`);
  }

  getAllClient(name: string) {
    return this.http.get<any>(`${environment.apiUrl}/v1/client/search?name=${name}`);
  }

  getAllClientContract(clientId: string, name: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/client/contract/search/${clientId}?name=${name}`,
    );
  }

  getAllClientContractProject(clientid: string, contractId: string, name: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/client/project/search/${clientid}/${contractId}?name=${name}`,
    );
  }

  getAllGang(projectId: string,name: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/projectsubteam/search/${projectId}?name=${name}`,
    );
  }

  getRecommendationList(options: ViewOptions) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/jobs/resource/demand/recommend`,
    );
  }
  getapprovedTransferList(options: ViewOptions, queryData: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/jobs/resource/demand/approved/report?page=${options.page}&size=200&fromDate=${queryData.fromDate}&toDate=${queryData.toDate}&searchText=${queryData.searchText}`,
    );
  }

  approveRejectTransfer(data: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/v1/jobs/resource/demand/process`,
      data,
    );
  }

  declineCandidate(data: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/v1/jobs/resource/demand/employee/reject`,
      data,
    );
  }
  acceptCandidate(data: any) {
    return this.http.post<any>(
      `${environment.apiUrl}/v1/jobs/resource/demand/employee/approve`,
      data,
    );
  }
  
}
