import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SlaPolicyServices {private apiUrl = environment.apiUrl + '/sla-policy';
  constructor(private http: HttpClient,
    private router: Router
  ) { }
  getSlaPolicies() {
  return this.http.get<any>(this.apiUrl+'/get-all-sla');
}
createSla(payload: any) {
  return this.http.post<any>(this.apiUrl+'/add-sla', payload);
}
deleteSla(id: string) {
  return this.http.delete<any>(`${this.apiUrl}/delete-sla/${id}`);
}
  



}