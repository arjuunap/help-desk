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
    //   console.log("==============",decodedToken);

    // console.log(decodedToken.role);

    // console.log(decodedToken.userId);

    // console.log(decodedToken.sub);

    // Check token expired
    if (jwtHelper.isTokenExpired(token)) {

      // Remove session
      localStorage.clear();
      sessionStorage.clear();

      // Redirect login
      router.navigate(['/login']);

      return EMPTY;

    }

    // Attach token
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};