import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReasonsService {

private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}reasons`;

  constructor(private http: HttpClient) {}

  public getAllReasons(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getReasonsById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addReasons(employerType: any): Observable<any> {
    return this.http.post(this.href, employerType);
  }

  public deleteReasons(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateReasons(employerType:any, id:any): Observable<any>{
    return this.http.patch(`${this.href}/${id}`,employerType)
  }

  public unblockReasons(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockReasons/${id}`);
  }
}
