import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DepartmentId } from 'src/app/globals';
import { Role } from 'src/app/_models';

import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (!route.data) {

        }

        if (user && (user.role === Role.SuperAdmin)) {
            return true;
        } else {
            this.authenticationService.logout();
            return false;
        }
    }
}
