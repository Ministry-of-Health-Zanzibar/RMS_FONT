import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RangereportService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href_parameter = `${this.baseUrl}accountant/reports/searchReportByParameter`;
  private href_final = `${this.baseUrl}accountant/reports/getDocumentFormReportByDate`;

  constructor(private http: HttpClient) {}

  generateDateReport(startDate: string, endDate: string): Observable<any> {
    return this.http.post<any>(this.href_final, { start_date: startDate, end_date: endDate });
  }

  public generateReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.href_parameter}`, data);
  }
}
