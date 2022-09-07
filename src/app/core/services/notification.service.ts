import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ViewOptions } from "src/app/_models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class NotificationService {

    constructor(private http: HttpClient) { }
    getAll() {
        return this.http.get<any>(`${environment.apiUrl}/v1/notification/load`);
    }

    markAsRead(id: string) {

        return this.http.post<any>(`${environment.apiUrl}/v1/notification/delete`, { eventId: id });

    }
}