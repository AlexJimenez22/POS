import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const roleGuard: CanMatchFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data?.['roles'] as string[]) ?? [];

  return toObservable(authService.userLoging_$).pipe(
    filter(user => user !== undefined && user !== null), 
    
    take(1),
    
    map(user => {
      const currentRole = user.role;

      if (!currentRole) {
        return router.createUrlTree(['/']);
      }

      if (allowedRoles.includes(currentRole)) {
        return true;
      }

      return router.createUrlTree(['/Core/Generate-Sale']);
    })
  );
};