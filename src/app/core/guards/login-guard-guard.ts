import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  // Already logged in
  
  if (token) {

    router.navigate(['/layout/home']);

    return false;
  }


  return true;
};