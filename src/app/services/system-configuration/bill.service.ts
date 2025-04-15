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

  constructor(private http: HttpClient) {}

  public getAllBill(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getBillById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
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

}
