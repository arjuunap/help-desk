import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DepartmentsServices {private apiUrl = environment.apiUrl + '/department';
  constructor(private http: HttpClient,
    private router: Router
  ) { }
  getDepartments() {
  return this.http.get<any>(this.apiUrl+'/get-all-department');
}
  


}
