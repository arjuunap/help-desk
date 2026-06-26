import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class KbArticlesService {

  constructor(private http: HttpClient,
    private router: Router
  ) { }
  private apiUrl = environment.apiUrl + '/kb'

  getArticles(){
    return this.http.get(`${this.apiUrl}/articles`)
  } 


}


