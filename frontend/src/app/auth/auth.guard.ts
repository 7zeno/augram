import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // We use take(1) and map to check the auth status once and then complete.
  return authService.isLoggedIn().pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // If logged in, allow access to the route
      }
      // If not logged in, redirect to the login page
      router.navigate(['/login']);
      return false;
    })
  );
};
