export class Registration {
    email!: string;
    password!: string;
    confirmPassword!: string;
    companyType!: string;
    acceptTerms !:boolean;
    constructor(data: any) {
        data = data || {};
        this.email = data.email;
        this.password = data.password;
        this.confirmPassword = data.confirmPassword;
        this.companyType = data.companyType;
        this.acceptTerms =data.acceptTerms;
    }
}
 