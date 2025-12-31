import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}userAccounts`;
  private hospitalUrl = `${this.baseUrl}hospitals`;

  
  private href_member = `${this.baseUrl}userAccounts/board-members`;

  constructor(private http: HttpClient) {}

  public getAllMemberList(): Observable<any> {
    return this.http.get<any>(this.href_member);
  }

  public getAllUsers(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public addUser(user: any): Observable<any> {
    return this.http.post(this.href, user);
  }

  public getUserById(id: any) {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public updateUser(user: any,id: any): Observable<any> {
    return this.http.put(`${this.href}/${id}`, user);
  }

  public blockUser(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public activateUser(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockUser/${id}`)
  }

  public getLogs(): Observable<any>{
    return this.http.get(`${this.baseUrl}logsFunction`)
  }

  // assign hospital to user
  public assignHospitalToUser(userId: number, payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}users/${userId}/assign-hospital`, payload);
  }

  // Optional: method to fetch hospitals
  public getHospitals(): Observable<any> {
    return this.http.get(`${this.hospitalUrl}`);
  }
}
