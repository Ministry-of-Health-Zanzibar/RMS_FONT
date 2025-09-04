import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private baseUrl: string = `${environment.baseUrl}payments`;

  constructor(private http: HttpClient) {}

  public addPayment(payment: any): Observable<any> {
    return this.http.post(this.baseUrl, payment);
  }

  public getAllPayments(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  public getPaymentById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  public updatePayment(id: any, payment: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, payment);
  }

  public deletePayment(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  public unblockPayment(id: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/unBlock/${id}`, {});
  }
}
