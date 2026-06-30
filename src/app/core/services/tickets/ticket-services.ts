import { Injectable } from '@angular/core';
import { TicketSubmitPayload } from '../../models/ticket';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TicketServices {
  constructor(private http: HttpClient,
    private router: Router
  ) { }
  private apiUrl = environment.apiUrl + '/tickets';

  submitTicket(formData: FormData) {
    return this.http.post(
      `${this.apiUrl}/create`,
      formData
    );
  }
  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all-ticket`);
  }
  
  getTicketById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-ticket/${id}`);
  }
 

  updateTicketStatus(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/status/${id}/update`, data);
  }
 
  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  
  getLogs() {
    return this.http.get<any[]>(`${environment.apiUrl}/audit/audit-logs`);
  }
  
  assignAgent(ticketId: number, assigneId: number) {
    return this.http.put(`${this.apiUrl}/${ticketId}/assign/${assigneId}`, null)
  }
  



}
