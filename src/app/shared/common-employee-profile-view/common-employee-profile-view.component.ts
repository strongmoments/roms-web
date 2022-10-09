import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-common-employee-profile-view',
    templateUrl: './common-employee-profile-view.component.html',
    styleUrls: ['./common-employee-profile-view.component.scss']
})
export class CommonEmployeeProfileViewComponent implements OnInit {
    @Input() record: any;
    constructor() {

    }

    ngOnInit(): void {
        console.log(this.record, 'rwecodd');
    }

}
