import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}bills`;
  private bill_payment = `${this.baseUrl}bills/getPatientBillAndPaymentByBillId`;
  private href_payment = `${this.baseUrl}payments`;

  constructor(private http: HttpClient) {}

  public getAllBill(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getBillById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }
  public getBillwithPayment(id: any): Observable<any> {
    return this.http.get<any>(`${this.bill_payment}/${id}`);
  }

  public addBill(bills: any): Observable<any> {
    return this.http.post(this.href,bills);
  }

  public deleteBill(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateBill(employerType:any, id:any): Observable<any>{
    return this.http.patch(`${this.href}/${id}`,employerType)
  }
  public unblockBill(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}bills/unBlock/${id}`, data);
  }

  //payment endpoint

  public addPayment(payment: any): Observable<any> {
    return this.http.post(this.href_payment,payment);
  }

}
