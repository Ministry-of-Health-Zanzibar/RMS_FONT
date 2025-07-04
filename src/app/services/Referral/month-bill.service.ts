import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MonthBillService {


  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}monthly-bills`;


  constructor(private http: HttpClient) {}

  public getAllMonthBill(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public addMonthBill(months: any): Observable<any> {
    return this.http.post(this.href, months);
  }


  public getMonthBillById(id: any) {
    return this.http.get<any>(`${this.href}/${id}`);
  }
  public updateMonth(month:any, id:any): Observable<any>{
    return this.http.patch(`${this.href}/${id}`,month)
  }
}
