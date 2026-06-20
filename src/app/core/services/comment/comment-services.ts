import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class CommentServices {

  private baseUrl = `${environment.apiUrl}/tickets/comment`;

  constructor(private http: HttpClient) {}

  /**
   * Get all comments for a ticket
   */
  getCommentsByTicketId(ticketId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${ticketId}/get-comments`);
  }

  /**
   * Add a new comment to a ticket
   */
  addComment(ticketId: number, comment: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${ticketId}/add-comment`, comment);
  }

  /**
   * Update a comment
   */
  updateComment(ticketId: number, commentId: number, comment: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${ticketId}/comments/${commentId}`, comment);
  }

  /**
   * Delete a comment
   */
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${commentId}/delete`);
  }
  deleteAttachment(attachmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/attachment/${attachmentId}/delete`);
  }
}
