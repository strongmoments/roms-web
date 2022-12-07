import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ViewOptions } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class JobService {

    constructor(private http: HttpClient) { }
    getAllResourceDemand() {
        return this.http.get<any>(`${environment.apiUrl}/v1/jobs/resource/demand`);
    }

    getDemandDetails(id: string){
        return this.http.get<any>(`${environment.apiUrl}/v1/jobs/resource/demand/${id}`);
    }

    getAllMyResourceDemand(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/jobs/resource/demand/mydemand/${id}`);
    }


    getAllClient(name: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/client/search?name=${name}`);
    }

    getAllClientContract(clientId: string, name: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/client/contract/search/${clientId}?name=${name}`);
    }

    getAllClientContractProject(clientContractid: string, name: string) {
        return this.http.get<any>(`${environment.apiUrl}/v1/client/project/search/{clientContractid}?name=${name}`);
    }



}
