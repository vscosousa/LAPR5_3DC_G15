

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';

@Injectable({
  providedIn: 'root',
})
export class DoctorGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = token ? this.loginService.getRoleFromToken(token) : null;
      if (role === 'Doctor') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}