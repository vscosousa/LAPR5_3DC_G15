/**
 * Guard for protecting routes that require authentication.
 * 
 * @service
 * @providedIn root
 * 
 * @class AuthGuard
 * 
 * @method canActivate Determines if the route can be activated based on the user's authentication status and role.
 */

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = token ? this.loginService.getRoleFromToken(token) : null;
      if (role === 'Admin') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}