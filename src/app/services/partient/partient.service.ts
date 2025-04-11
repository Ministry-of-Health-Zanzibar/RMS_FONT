import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartientService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}patients`;

  constructor(private http: HttpClient) {}

  public getAllPartients(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public addPartient(Partient: any): Observable<any> {
    return this.http.post(this.href, Partient);
  }

  public getPartientById(id: any) {
    return this.http.get<any>(`${this.href}/${id}`);
  }


  public deletePatient(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updatePartient(patient:any, id:any): Observable<any>{
    return this.http.patch(`${this.href}/${id}`,patient)
  }

  public unblockPatient(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}patients/unBlock/${id}`, data);
  }


}

