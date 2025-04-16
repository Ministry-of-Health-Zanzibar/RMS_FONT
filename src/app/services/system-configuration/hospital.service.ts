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

  public addHospital(hospital: any): Observable<any> {
    return this.http.post(this.href, hospital);
  }

  public deleteHospital(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateHospital(hospital:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,hospital)
  }

  public unblockHospital(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}hospitals/unBlock/${id}`, data);
  }

  // public unblockHospital(id:any): Observable<any>{
  //   return this.http.patch(`${this.href}/unblock/${id}`);
  // }
}

