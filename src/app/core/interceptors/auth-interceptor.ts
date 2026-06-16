import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  const router = inject(Router);

  const jwtHelper = new JwtHelperService();

  if (token) {
    const decodedToken = jwtHelper.decodeToken(token);
    
    if (jwtHelper.isTokenExpired(token)) {

      // Remove session
      localStorage.clear();
      sessionStorage.clear();

      // Redirect login
      router.navigate(['/login']);
      
      return EMPTY;
    }
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};