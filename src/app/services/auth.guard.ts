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

    // If the user is logged in, navigate to the home page
    if (isLoggedIn) {
      return this.router.parseUrl('/');
    }

    // If the user is not logged in, allow access to the login page
    return true;
  }
}
