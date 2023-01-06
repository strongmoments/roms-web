import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable()
export class Globals {
    username: string = '';
    isCollapse: boolean = false;
    isLoader: boolean = false;
    fullPage: boolean = false;
    defaultId: string = '303030303030303030303030'
    passwordHint: string = `Password should be at least 8 characters long and \n should contain one number,\none character and one special character`
    defaultAbn: number = 75493363262
    defaultUsi: string = 'CBU0100AU'
    baseUrl = environment.apiUrl
    generateFileUrl(url: string, token: any) {
        return `${this.baseUrl}${url}&key=${token}`;
    }

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
    getTitle(key: string, id: any) {
        let instance: any = this;
        if (key && (id || id == '0') && instance[key] !== undefined && instance[key] !== null) {
            let ele: any = instance[key].find((elem: any) => elem.value == id);
            return ele && ele.name ? ele.name : '';
        } else {
            return '';
        }
    }

    getClass(key: string, id: any) {
        let instance: any = this;
        if (key && id && instance[key] !== undefined && instance[key] !== null) {
            let ele: any = instance[key].find((elem: any) => elem.value == id);
            return ele && ele.class ? ele.class : '';
        } else {
            return '';
        }
    }

    getIcon(key: string, id: any) {
        let instance: any = this;
        if (key && id && instance[key] !== undefined && instance[key] !== null) {
            let ele: any = instance[key].find((elem: any) => elem.value == id);
            return ele && ele.icon ? ele.icon : '';
        } else {
            return '';
        }
    }

    leaveStatus = [
        { name: 'Pending', icon: 'hourglass_top', value: 1, colorClass: 'pending', checkboxColorClass: 'pending-checkbox' },
        { name: 'Approved', icon: 'thumb_up', value: 2, colorClass: 'approved', checkboxColorClass: 'approved-checkbox' },
        { name: 'Rejected', icon: 'thumb_down', value: 3, colorClass: 'rejected', checkboxColorClass: 'rejected-checkbox' },

    ]

    userApplicationStatus = [
        { name: 'Pending', icon: 'hourglass_top', value: 1, colorClass: 'pending' },
        { name: 'Completed', icon: 'thumb_up', value: 2, colorClass: 'approved' },
        // { name: 'Rejected', value: 3, colorClass: 'rejected',checkboxColorClass: 'rejected-checkbox' },

    ]

    role = [
        { name: 'Admin', value: Role.Admin, listTitle: 'Admin' },
        { name: 'Super Admin', value: Role.SuperAdmin, listTitle: 'SuperAdmin' },
    ];

    // status = [
    //     { value: true, name: 'Active' },
    //     { value: false, name: 'Inactive' }
    // ];


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

    // department = [
    //     { name: 'SEO', value: DepartmentId.seo, listTitle: 'seo' },
    //     { name: 'Node DEPARTMENT', value: DepartmentId.node, listTitle: 'node' },
    // ];


    demandTypes = [
        { name: 'Internal', value: '1' },
        { name: 'External', value: '2' },
        { name: 'Both', value: '3' }
    ]


    superAnnutationType = [
        { name: 'My Current Fund', value: '1' },
        { name: 'Self Managed fund(SMSF)', value: '2' },
        { name: 'Employer nominated', value: '3' }
    ]

    tfnType = [
        { name: 'Australian resident', value: '1' },
        { name: 'Foreign resident', value: '2' },
        { name: 'A working holiday maker', value: '3' }
    ]

    assetClass = [
        { name: 'Mobile Plant', value: 'mobileplant' },
        { name: 'Fixed Plant', value: 'fixedplant' }
    ]

    assetType = [
        { name: 'Dozer', value: '1' }
    ]

    assetCategory = [
        { name: 'DozerA', value: '1' }
    ]


    assetStatus = [
        { name: 'Available', value: 1, icon: 'no_crash',colorClass: 'approved'},
        { name: 'Down', value: 2, icon: 'car_crash',colorClass: 'pending',  },
        { name: 'Disposed', value: 3, icon: 'car_repair',colorClass: 'rejected', }
    ]
    assetOwnership = [
        { name: 'owned', value: 1, icon: 'account_balance',colorClass: 'approved'},
        { name: 'rented', value: 2, icon: 'car_rental',colorClass: 'pending',  },
        // { name: 'Disposed', value: 3, icon: 'car_repair',colorClass: 'rejected', }
    ]

    phoneCode = [
        {
            name: '+61', value: '+61',
        },
        {
            name: '+91', value: '+91'
        }
    ]

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
