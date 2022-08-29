export class UserAuth {
    id?: number;
    fullName?: string;
    email?: string;
    role?: string;
    companyId?: string;
    password!: string;
    active?: boolean;
    constructor(data: any) {
        data = data || {};
        this.fullName = data.fullName;
        this.email = data.email;
        this.companyId = data.companyId;
        this.password = data.password;
        this.role = data.role;
        this.active = true;
    }
}
