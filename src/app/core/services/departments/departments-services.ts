import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  getDepartmentById(id: number) {
  return this.http.get<any>(this.apiUrl + '/get-department-by-id/' + id);
}

  createDepartment(department: any) {
  return this.http.post<any>(this.apiUrl + '/add-department', department);
}

assignManager(departmentId: number, managerId: number) {
  return this.http.patch<any>(environment.apiUrl + `/admin/assign-department-manager/${departmentId}`, managerId);
}

  


}
