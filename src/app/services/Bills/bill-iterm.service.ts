import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillItermService {
  private baseUrl: string = `${environment.baseUrl}bill-items`;

  constructor(private http: HttpClient) {}

  public addbillIterms(billIterm: any): Observable<any> {
    return this.http.post(this.baseUrl, billIterm);
  }

  public getAllBillIterm(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  public getbillItermByID(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  public deletebillIterms(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  public updatebillIterms(billFile: any, id: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, billFile);
  }

  public unblockbillIterm(id: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/unBlock/${id}`, {});
  }

  public getbillItermByBillId(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/by-bill-id/${id}`);
  }
}
