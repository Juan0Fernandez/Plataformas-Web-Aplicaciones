import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { UserRole } from '../../shared/interfaces/role.interface';
import { map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Guard para proteger rutas según el rol del usuario
 * Uso: canActivate: [roleGuard], data: { roles: [UserRole.ADMIN] }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[];

  return authService.user$.pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        router.navigate(['/login']);
        return of(false);
      }

      return userService.getUserRole(user.uid).then(role => {
        if (role && requiredRoles.includes(role)) {
          return true;
        } else {
          // Redirigir según el rol
          if (role === UserRole.ADMIN) {
            router.navigate(['/admin']);
          } else if (role === UserRole.PROGRAMMER) {
            router.navigate(['/programmer']);
          } else {
            router.navigate(['/portfolio']);
          }
          return false;
        }
      });
    })
  );
};

/**
 * Guard específico para admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
  route.data = { ...route.data, roles: [UserRole.ADMIN] };
  return roleGuard(route, state);
};

/**
 * Guard específico para programadores
 */
export const programmerGuard: CanActivateFn = (route, state) => {
  route.data = { ...route.data, roles: [UserRole.PROGRAMMER, UserRole.ADMIN] };
  return roleGuard(route, state);
};
