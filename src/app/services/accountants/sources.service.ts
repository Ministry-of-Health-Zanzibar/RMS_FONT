import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SourcesService {
 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}sources`;

  constructor(private http: HttpClient) {}

  public getAllSource(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getSourceById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addSource(Source: any): Observable<any> {
    return this.http.post(this.href, Source);
  }

  public deleteSource(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateSource(Source:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,Source)
  }

  public unblockSource(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}sources/unBlock/${id}`, data);
  }

  // public unblockHospital(id:any): Observable<any>{
  //   return this.http.patch(`${this.href}/unblock/${id}`);
  // }
}

