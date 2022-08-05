export class Company {
    id!: string;
    companyName!: string;
    companyShortName!: string;
    phone!: string;
    logo!: string;
    email!: string;
    address!: string;  
    website!: string;
    totalUsers!: string;
    isActive!: boolean;
    
    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.companyName =data.companyName;
        this.phone =data.phone;
        this.logo =data.logo;
        this.email =data.email;
        this.address =data.address;
        this.website =data.website;
        this.totalUsers =data.totalUsers;
        this.isActive =data.isActive;
    }
}
 