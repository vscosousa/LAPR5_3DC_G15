import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../Services/login.service';

/**
 * @class PatientGuard
 * @description Guard to protect routes that should only be accessible to patients.
 * @vscosousa - 12/11/2024
 */
@Injectable({
  providedIn: 'root',
})
export class PatientGuard implements CanActivate {
  /**
   * @constructor
   * @param {LoginService} loginService - Service to handle login-related operations.
   * @param {Router} router - Router to navigate to different routes.
   * @vscosousa - 12/11/2024
   */
  constructor(private loginService: LoginService, private router: Router) { }

  /**
   * Determines whether a route can be activated.
   * @method canActivate
   * @param {ActivatedRouteSnapshot} next - The activated route snapshot.
   * @param {RouterStateSnapshot} state - The router state snapshot.
   * @returns {boolean} - Returns true if the route can be activated, otherwise false.
   * @vscosousa - 12/11/2024
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = token ? this.loginService.getRoleFromToken(token) : null;
      if (role === 'Patient') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
