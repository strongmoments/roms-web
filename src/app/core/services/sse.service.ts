import { Injectable, NgZone } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: "root"
})
export class SseService {
    private eventSource!: EventSource;
    constructor(private _zone: NgZone) { }
    getServerSentEvent(url: string): Observable<MessageEvent> {
        return Observable.create((observer: any) => {
            let eventSource = this.getEventSource(url);

            eventSource.onmessage = event => {
                this._zone.run(() => {
                    observer.next(event.data)
                })
            }

            eventSource.onopen = event => {
                this._zone.run(() => {
                    console.log(event, 'akjshdkj')
                      observer.next(event)
                })
            }

            eventSource.onerror = event => {
                this._zone.run(() => {
                    observer.error(event)
                })
            }

            // eventSource.onopen = (ev: any) => {
            //     console.log('Connection to server opened.', ev);
            // };
            // eventSource.onerror = (ev: any) => {
            //     console.log('EventSource failed.', ev);
            // };
            // eventSource.addEventListener('message', event => {
            //     this._zone.run(() => {
            //         observer.next(event);
            //     });
            // });

            console.log(eventSource, 'aslaks')
        });
    }
    private getEventSource(url: string): EventSource {
        if (this.eventSource) {
            console.log('EventSource closed.');
            this.eventSource.close();
        }
        this.eventSource = new EventSource(url);
        return this.eventSource;
    }
}