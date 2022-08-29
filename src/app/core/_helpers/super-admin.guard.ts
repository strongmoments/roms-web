import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Role } from 'src/app/globals';

import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class SuperAdminGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (user && (user.role?.includes(Role.SuperAdmin.toString()))) {
            return true;
        } else {
            this.authenticationService.logout();
            return false;
        }
    }
}
