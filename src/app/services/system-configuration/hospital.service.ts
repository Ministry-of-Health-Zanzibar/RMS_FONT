import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}hospitals`;

  constructor(private http: HttpClient) {}

  public getAllHospital(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getHospitalById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addHospital(employerType: any): Observable<any> {
    return this.http.post(this.href, employerType);
  }

  public deleteHospital(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateHospital(employerType:any, id:any): Observable<any>{
    return this.http.patch(`${this.href}/${id}`,employerType)
  }

  public unblockHospital(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}unBlockHospital/${id}`);
  }
}

