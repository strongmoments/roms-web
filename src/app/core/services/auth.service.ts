import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of, EMPTY, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_models';
import jwt_decode from 'jwt-decode';
import { Role } from 'src/app/globals';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    public refreshTokenTimeout: any;

    constructor(private router: Router, private http: HttpClient,
        @Inject('LOCALSTORAGE') private localStorage: Storage) {
        const userData = this.getUserData();
        this.userSubject = new BehaviorSubject<User>(userData);
        this.user = this.userSubject.asObservable();
    }
    getUserData() {
        const userData = localStorage.getItem(environment.localStorage) || sessionStorage.getItem(environment.localStorage);
        //const userData = JSON.parse(this.localStorage.getItem(environment.localStorage)!);
        
        return JSON.parse(userData!)
    }
    saveUserData(user: any) {
        const rememberMe = this.localStorage.getItem('rememberMe') || 'no';
        delete user.message;
        if (rememberMe === 'yes') {
            this.localStorage.setItem(environment.localStorage, JSON.stringify(user));
        } else {
            sessionStorage.setItem(environment.localStorage, JSON.stringify(user));
        }
        // this.localStorage.setItem(environment.localStorage, JSON.stringify(user));
    }
    public getRememberMe() {
        return this.localStorage.getItem('rememberMe') || 'no';
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(email: string, password: string, rememberMe: boolean) {
        return this.http.post<any>(`${environment.apiUrl}/users/login`, { email, password }, { withCredentials: true })
            .pipe(map(user => {
                let useData = jwt_decode(user.accessToken) as any;
                if (useData !== null && useData !== undefined) {
                    console.log(useData);
                    console.log("data", useData)
                    user.email = useData.email;
                    user.id = useData.id;
                    user.role = useData.role;
                    user.fullName = useData.fullName;
                }
                this.localStorage.setItem('rememberMe', rememberMe ? 'yes' : 'no');
                this.saveUserData(user);
                this.userSubject.next(user);
                return user;
            }));
    }

    updateImage(image: string) {
        return this.http.post(`${environment.apiUrl}/users/update-image`, { imageFile: image })
    }
    getProfileImage(image: string) {
        return this.http.post(`${environment.apiUrl}/users/get-image`, { imageFile: image })
    }

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.userSubject.value.authData?.split('.')[1] || ''));
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }


    refreshToken() {
        return this.http.post<any>(`${environment.apiUrl}/users/refresh-token`, {}, { withCredentials: true })
            .pipe(map((user) => {
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));

    }


    logout(): void {
        this.http.post<any>(`${environment.apiUrl}/users/revoke-token`, {}, { withCredentials: true });
        this.localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/']);

    }

    verifyEmail(token: string) {
        return this.http.post(`${environment.apiUrl}/users/verify-email`, { token: token },)
    }
    forgotPassword(email: string) {
        return this.http.post(`${environment.apiUrl}/users/forgot-password`, { email: email },)
    }
    setImage(imageName: string) {
        const userData = this.getUserData();
        userData.imageFile = imageName;
        this.saveUserData(userData);
    }

    getCurrentUser(): any {
        return {
            token:'token',
            isSuperAdmin: 'isSuperAdmin',
            isAdmin: true,
            role: 'role',
            email: 'test@hmasil.com',
            companyId: 'companyId',
            id: 'id',
            department: 'department',
            companyName: 'companyName',
            expiration: 'expiration',
            fullName: 'John wick',
            image: 'image'

        }
        // const userData = this.getUserData();
        // if (userData !== null) {

        //     console.log(userData);

        //     return {
        //         token: userData.accessToken,
        //         isSuperAdmin: userData.role.includes(Role.SuperAdmin.toString()),
        //         isAdmin: (userData.role.includes(Role.Admin.toString()) || userData.role.includes(Role.SuperAdmin.toString())),
        //         role: userData.role,
        //         email: userData.email,
        //         companyId: userData.companyId,
        //         id: userData.id,
        //         department: userData.department,
        //         companyName: userData.companyName,
        //         expiration: userData.expires,
        //         fullName: userData.fullName,
        //         image: `${environment.imageUrl}${userData.imageFile}`
        //     };
        // }
    }

    passwordResetRequest(email: string) {
        return of(true);
    }

    changePassword(email: string, oldPwd: string, newPwd: string) {
        return this.http.post(`${environment.apiUrl}/accounts/change-password`, {
            email: email,
            password: oldPwd,
            newPassword: newPwd
        })
    }


    passwordReset(token: string, password: string, confirmPassword: string): any {
        return this.http.post(`${environment.apiUrl}/accounts/reset-password`, {
            token: token,
            password: password,
            confirmPassword: confirmPassword
        })
    }



}