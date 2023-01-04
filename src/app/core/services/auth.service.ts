import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of, EMPTY, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, ViewOptions } from 'src/app/_models';
// import jwt_decode from 'jwt-decode';
import { Role } from 'src/app/globals';
import { SseService } from './sse.service';
import { EmployeeService } from './employee.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public refreshTokenTimeout: any;
  public newRegistrationData: any = {};
  private newRegistrationSubject = new BehaviorSubject(this.newRegistrationData);
  addedResigstration = this.newRegistrationSubject.asObservable();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private http: HttpClient,
    @Inject('LOCALSTORAGE') private localStorage: Storage,
    private sseService: SseService,
  ) {
    const userData = this.getUserData();
    this.userSubject = new BehaviorSubject<User>(userData);
    this.user = this.userSubject.asObservable();
    setTimeout(() => {
      this.updateUserImage();
    }, 2000);
  }
  getUserData() {
    const userData =
      localStorage.getItem(environment.localStorage) ||
      sessionStorage.getItem(environment.localStorage);
    //const userData = JSON.parse(this.localStorage.getItem(environment.localStorage)!);

    return JSON.parse(userData!);
  }
  saveUserData(user: any) {
    // const rememberMe = this.localStorage.getItem('rememberMe') || 'no';
    // delete user.message;
    // if (rememberMe === 'yes') {
    this.localStorage.setItem(environment.localStorage, JSON.stringify(user));
    // } else {
    // sessionStorage.setItem(environment.localStorage, JSON.stringify(user));
    // }
    // this.localStorage.setItem(environment.localStorage, JSON.stringify(user));
  }
  public getRememberMe() {
    return this.localStorage.getItem('rememberMe') || 'no';
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string, rememberMe: boolean) {
    return this.http
      .post<any>(`${environment.apiUrl}/authenticate`, {
        username: username,
        password: password,
        orgId: environment.orgId,
      })
      .pipe(
        map((user) => {
          console.log(user);
          // let useData = jwt_decode(user.accessToken) as any;
          // if (useData !== null && useData !== undefined) {
          //     console.log(useData);
          //     console.log("data", useData)
          //     user.email = useData.email;
          //     user.id = useData.id;
          //     user.role = useData.role;
          //     user.fullName = useData.fullName;
          // }
          // this.localStorage.setItem('rememberMe', rememberMe ? 'yes' : 'no');
          this.saveUserData(user);
          this.userSubject.next(user);
          return user;
        }),
      );
  }

  updateUser(image: string) {
    return this.http.post(`${environment.apiUrl}/users/update-image`, { imageFile: image });
  }
  getProfileImage(image: string) {
    return this.http.post(`${environment.apiUrl}/users/get-image`, { imageFile: image });
  }

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userSubject.value.authData?.split('.')[1] || ''));
    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  refreshToken() {
    return this.http
      .post<any>(`${environment.apiUrl}/users/refresh-token`, {}, { withCredentials: true })
      .pipe(
        map((user) => {
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          return user;
        }),
      );
  }

  updateUserImage() {
    let user = this.getUserData();
    if (user && user.userDetail) {
      this.employeeService.getById(user.userDetail.id).subscribe((res) => {
        user.userDetail = res;
        console.log('before', 'useruser');
        this.saveUserData(user);
        console.log('after', 'useruser');

        // user.userDetail['profileImage']=[{digitalAssets:{url}}];
        this.userSubject.next(user);
      });
    }
  }

  logout(): void {
    // this.http.post<any>(`${environment.apiUrl}/users/revoke-token`, {}, { withCredentials: true });
    this.sseService.closeServer();
    this.localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/');
    // this.router.navigate(['/']);
  }

  verifyEmail(token: string) {
    return this.http.post(`${environment.apiUrl}/users/verify-email`, { token: token });
  }
  forgotPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/users/forgot-password`, { email: email });
  }
  setImage(imageName: string) {
    const userData = this.getUserData();
    userData.imageFile = imageName;
    this.saveUserData(userData);
  }

  getUserPermission() {
    const userData = this.getUserData();
    if (userData) {
      return {
        menus: userData.menus,
      };
    } else {
      return {};
    }
  }

  getCurrentUser(): any {
    const userData = this.getUserData();
    // console.log(userData,'userData')
    if (userData) {
      return {
        token: userData.token,
        ...userData.userDetail,
      };
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

  passNewRegistration(data: any) {
    console.log(data, 'data.inssdkskjkd');
    this.newRegistrationSubject.next(data);
  }

  passwordReset(token: string, password: string, confirmPassword: string): any {
    return this.http.post(`${environment.apiUrl}/accounts/reset-password`, {
      token: token,
      password: password,
      confirmPassword: confirmPassword,
    });
  }

  register(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/addUserRequest`, data);
  }

  getDashboard() {
    return this.http.get<any>(`${environment.apiUrl}/v1/dashboard/load`);
  }

  changePassword(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/password/change`, data);
  }

  getAllRoles() {
    return this.http.get<any>(`${environment.apiUrl}/v1/roles/load`);
  }

  getAllManagers(name: string = '') {
    return this.http.get<any>(`${environment.apiUrl}/v1/employee/manager?name=${name}`);
  }

  getAllEmployeeType() {
    return this.http.get<any>(`${environment.apiUrl}/v1/employeetypes/load`);
  }

  getAllDepartmentType() {
    return this.http.get<any>(`${environment.apiUrl}/v1/departments/load`);
  }

  saveExportHistory(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/leaveexport/addhistory`, data);
  }

  getAllExportHistory(options: ViewOptions) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/leaveexport/loadhistory?page=${options.page}&size=${options.pageSize}`,
    );
  }

  saveResignationExportHistory(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/resignation/export`, data);
  }

  getAllResignationExportHistory(options: ViewOptions) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/resignation/loadexporthistory?page=${options.page}&size=${options.pageSize}`,
    );
  }

  getAllEmployeeRegisterReq() {
    return this.http.get<any>(`${environment.apiUrl}/v1/user/loadPendingUsers`);
  }

  createUser(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/user/add`, data);
  }

  getTicketsList(value: string) {
    return this.http.get<any>(`${environment.apiUrl}/v1/employeeskils/plant/search?name=${value}`);
  }

  cretaTicket(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/employeecetoken`, data);
  }

  getLicenseList(value: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/employeeskils/licence/search?name=${value}`,
    );
  }

  createLicence(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/employeecetoken`, data);
  }

  getCertificationsList(value: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/employeeskils/cirtificate/search?name=${value}`,
    );
  }

  createCertification(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/employeecertificates`, data);
  }

  getFile(id: string, file: string, type: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/v1/files?id=${id}&fileName=${file}&type=${type}`,
    );
  }

  uploadFile(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/files/upload`, data, {});
  }

  removeRegistration(emailId: string) {
    return this.http.delete<any>(`${environment.apiUrl}/v1/user/${emailId}`);
  }

  createDemand(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/v1/jobs/resource/demand`, data);
  }

  
}
