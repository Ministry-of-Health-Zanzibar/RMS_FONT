import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphreportService {

  private baseUrl: string = `${environment.baseUrl}`;

  constructor(private http: HttpClient) { }

  public getDocumentPerWeekReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}accountant/reports/reportPerWeekly`);
  }

  public getDocumentPerMonthReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}accountant/reports/reportPerMonthly`);
  }

  public getSourceReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}accountant/reports/reportBySourceType`);
  }

  public getDocumentTypeReport(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}accountant/reports/reportPerDocumentType`);
  }

}
