import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SourceTypeService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}sourceTypes`;

  constructor(private http: HttpClient) {}

  public getAllSourceType(): Observable<any> {
    return this.http.get<any>(this.href);
  }
  public getSourceTypesBySourceName(sourceName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}sourceTypes/source/${sourceName}`);
  }


  public getSourceTypeById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addSourceType(Source: any): Observable<any> {
    return this.http.post(this.href, Source);
  }

  public deleteSourceType(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateSource(Source:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,Source)
  }

  public unblockSourceType(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}sourceTypes/unBlock/${id}`, data);
  }

}
