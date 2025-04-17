import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StatisticalService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}reports/referralByHospital`;

  private href_statistical = `${this.baseUrl}getClientComplainReports`;


  constructor(private http: HttpClient) { }

  public getCount(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getClientReport(): Observable<any> {
    return this.http.get<any>(this.href_statistical);
  }
}