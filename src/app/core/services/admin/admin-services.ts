import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../models/auth-response';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AdminServices {
    private apiUrl = environment.apiUrl + '/admin';

     constructor(private http: HttpClient,
    private router: Router
  ) { }

    getAgents(){
      return this.http.get<any[]>(`${this.apiUrl}/fetch-agents`);
    
    }
    createAgentStaff(data : any){
      return this.http.post<any>(`${this.apiUrl}/create-subordinate`,data);
    }
    

}
