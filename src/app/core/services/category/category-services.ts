import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../models/auth-response';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryDto } from '../../models/ticket';
@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private apiUrl = environment.apiUrl + '/category';
  constructor(private http: HttpClient,
    private router: Router
  ) { }
  getCategories() {
  return this.http.get<CategoryDto[]>(this.apiUrl+'/get-all-category');
}

  

}
