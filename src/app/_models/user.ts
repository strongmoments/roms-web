export class User {
    id?: number;
    fullName?: string;
    expires?: string;
    authData?: string;
    role?: string;
    department?: string;
    active?: boolean;
    constructor(data: any) {
        data = data || {};
        this.fullName = data.fullName;
        this.expires = data.expires;
        this.authData = data.authData;
        this.role = data.role;
        this.active =true;
        this.department = data.department;
    }
}


export enum Role {
    SuperAdmin = 'SuperAdmin',
    Hr = 'Hr',
    Account = 'Account',
    Manager = 'Manager',
    Employee = 'Employee'
}
