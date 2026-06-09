import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class BillFileService {
  private baseUrl: string = `${environment.baseUrl}bill-files`;

  private monthbillUrl: string = `${environment.baseUrl}bill-files/summary-by-hospital`;
  private hospitalbyid: string = `${environment.baseUrl}bill-files/hospital`;


  private baseUrls: string = `${environment.baseUrl}hospitals/reffered-hospitals`;
  private baseUrlss: string = `${environment.baseUrl}bills-by-bill-file`;
  private baseUrlForPayment: string = `${environment.baseUrl}bill-files/bill-files-for-payment/payment`;
  private baseUrlBillFileByHospital: string = `${environment.baseUrl}bill-files/hospital-bills/hospitals`;
  // private baseUrlForPayments: string = `${environment.baseUrl}bill-files/hospitals`;
  // private baseUrlForPayments = 'http://localhost:8000/api/bill-files/hospitals';

  // private baseUrlForPayments:  string = `${environment.baseUrl}bill-files/hospitals`;
    private baseUrlForPayments: string = `${environment.baseUrl}bill-files/hospitals`;

  constructor(private http: HttpClient) {}

  public addbillFileLetter(billFile: any): Observable<any> {
    return this.http.post(this.baseUrl, billFile);
  }

  public getAllBillFiles(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  public viewMonthBills(): Observable<any> {
    return this.http.get<any>(this.monthbillUrl);
  }
  public getAllBillFilesForPayment(): Observable<any> {
    return this.http.get<any>(this.baseUrlForPayment);
  }

  public getAllBillFilesForPaymentById(hospitalId: number): Observable<any> {
    const url = `${this.baseUrlForPayments}/${hospitalId}`;
    return this.http.get<any>(url);
  }

   public getBillsByHospitalId(hospitalId: number): Observable<any> {
    const url = `${this.hospitalbyid}/${hospitalId}`;
    return this.http.get<any>(url);
  }

  public getAllHospital(): Observable<any> {
    return this.http.get<any>(this.baseUrls);
  }

  public getbillFilesById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  public addBillFiles(billFile: any): Observable<any> {
    return this.http.post(this.baseUrl, billFile);
  }

  public deletebillFiles(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  public updatebillFiles(billFile: any, id: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update/${id}`, billFile);
  }

  public unblockbillFiles(id: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/unBlock/${id}`, {});
  }

  public getbillsBybillFile(bill_file_id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrlss}/${bill_file_id}`);
  }

  public getAllBillFilesByHospital(): Observable<any> {
    return this.http.get<any>(this.baseUrlBillFileByHospital);
  }
}
