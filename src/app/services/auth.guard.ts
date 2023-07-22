import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    // Check if the user is logged in
    const isLoggedIn = this.authService.getLoggedInStatus();

    // If the user is not logged in, redirect to the login page
    if (!isLoggedIn) {
      return this.router.parseUrl('/login');
    }

    // If the user is logged in, allow access
    return true;
  }
}
