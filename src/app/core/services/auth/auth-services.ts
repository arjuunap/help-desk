import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../models/auth-response';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private apiUrl = environment.apiUrl + '/auth';
  constructor(private http: HttpClient,
    private router: Router
  ) { }

    jwtHelper = new JwtHelperService();

    googleLogin() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }


  getUsers() {
    return this.http.get(`${this.apiUrl}/get-users`);

  }
  googlelogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  userLogin(data: any) {
    return this.http.post<AuthResponse>(this.apiUrl + '/login', data);
  }

  logout() {

    localStorage.removeItem('token');
    // window.location.href = '/login';
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

    getDecodedToken() {

    const token = this.getToken();

    if (!token) return null;

    return this.jwtHelper.decodeToken(token);
  }

  getRole(): string {

    const decodedToken = this.getDecodedToken();

    return decodedToken?.role || '';
  }

  UserDetails() {
    return this.http.get(this.apiUrl + '/me');
  }

}
