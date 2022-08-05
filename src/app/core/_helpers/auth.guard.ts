import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
 

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return true;

        // const user = this.authenticationService.userValue;
        // if (!route.data) {
            
        // }
        // if (user) {
        //     // logged in so return true
        //     return true;
        // } else {
        //     // this.authenticationService.logout();
        //     this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        //     return false;
        // }
    }
}