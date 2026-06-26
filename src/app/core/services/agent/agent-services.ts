import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AgentServices {
  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }




  getAgentStaffs(agentId: number) {
    return this.http.get(
      `${this.apiUrl}/auth/fetch-staffs/${agentId}`
    );
  }
  assignAgent(agentId: number, staffId: number) {
    return this.http.patch(`${this.apiUrl}/admin/assign-agent`, { agentId, staffId });
  }

  getAgentWorkLoad(){
    return this.http.get(`${this.apiUrl}/admin/agent-workload`)
  }


}
