import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  private baseUrl: string = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  //data from api
  public allPermissions(): Observable<any> {
    const href = `${this.baseUrl}permissions`;
    return this.http.get<any>(href);
  }

  public getAllRoles(): Observable<any> {
    const href = `${this.baseUrl}roles`;
    return this.http.get<any>(href);
  }

  public addRoles(roles: any): Observable<any> {
    return this.http.post(`${this.baseUrl}roles`, roles);
  }

  public deleteRole(id:any): Observable<any>{
    return this.http.delete(`${this.baseUrl}roles/${id}`);
  }

  public updateRoles(roles:any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}roles/${id}`,roles)
  }


  public displayRolesPermission(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}roles/${id}`);
  }
}
