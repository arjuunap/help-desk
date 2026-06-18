import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../models/auth-response';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private apiUrl = environment.apiUrl + '/category';
  constructor(private http: HttpClient,
    private router: Router
  ) { }
  getCategories() {
  return this.http.get<any[]>(this.apiUrl+'/get-all-category');
}
  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-category`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  

}
