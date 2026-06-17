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
}
