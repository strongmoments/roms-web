import { Injectable } from '@angular/core';
@Injectable()
export class Globals {
    username: string = '';
    isCollapse: boolean = false;
    isLoader: boolean = false;
    fullPage: boolean = false;
    defaultId: string = '303030303030303030303030'
    passwordHint: string = `Password should be at least 8 characters long and \n should contain one number,\none character and one special character`
    whatClassIsIt(someValue: number) {
        if (someValue == 1)
            return "green"
        else
            return "red";
    }
    yesNo(isYes: boolean) {
        return isYes ? 'Yes' : 'No'
    }
    toTitleCase(str: string) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    leaveStatus = [
        { name: 'Pending', value: 1, colorClass: 'pending',checkboxColorClass: 'pending-checkbox' },
        { name: 'Approved', value: 2, colorClass: 'approved',checkboxColorClass: 'approved-checkbox' },
        { name: 'Rejected', value: 3, colorClass: 'rejected',checkboxColorClass: 'rejected-checkbox' },

    ]

    role = [
        { name: 'Admin', value: Role.Admin, listTitle: 'Admin' },
        { name: 'Super Admin', value: Role.SuperAdmin, listTitle: 'SuperAdmin' },
    ];

    status = [
        { value: true, viewValue: 'Active' },
        { value: false, viewValue: 'Inactive' }
    ];


    leaveTypes = [
        { name: 'sick', value: 'sick' },
        { name: 'rostered day off', value: 'roster_day_off' },
        { name: 'carer\'s', value: 'carer' },
        { name: 'annual', value: 'annual' },
        { name: 'without pay', value: 'without_pay' },
        { name: 'bereavement', value: 'bereavement' },
        { name: 'domestic voilence', value: 'domestic_voilence' },
        { name: 'community service', value: 'community_service' },
        { name: 'parental', value: 'parental' },
        { name: 'long service', value: 'long_service' },
    ]

    department = [
        { name: 'SEO', value: DepartmentId.seo, listTitle: 'seo' },
        { name: 'Node DEPARTMENT', value: DepartmentId.node, listTitle: 'node' },
    ];

}

export enum DepartmentId {
    seo = 'seo',
    node = "node"
}

export enum Role {
    User = 'user',
    Admin = 'admin',
    SuperAdmin = 'SuperAdmin',
}
