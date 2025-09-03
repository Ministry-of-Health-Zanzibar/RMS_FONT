import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class BillFileService {
  private baseUrl: string = `${environment.baseUrl}bill-files`;
  private baseUrlss: string = `${environment.baseUrl}bills-by-bill-file`;


  constructor(private http: HttpClient) {}

  public addbillFileLetter(billFile: any): Observable<any> {
    return this.http.post(this.baseUrl, billFile);
  }

  public getAllBillFiles(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
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
    return this.http.patch(`${this.baseUrl}/${id}`, billFile);
  }

  public unblockbillFiles(id: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/unBlock/${id}`, {});
  }

   

  public getbillsBybillFile(bill_file_id: any): Observable<any> {
  return this.http.get<any>(`${this.baseUrlss}/${bill_file_id}`);
}

}
