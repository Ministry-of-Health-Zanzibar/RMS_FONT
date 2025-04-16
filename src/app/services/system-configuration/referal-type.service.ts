
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ReferalTypeService {
  unblockReferalType(id: any, referral_type_id: any) {
    throw new Error('Method not implemented.');
  }
private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}referralTypes`;

  constructor(private http: HttpClient) {}

  public getAllReferalType(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getReferalTypeById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addReferalType(employerType: any): Observable<any> {
    return this.http.post(this.href, employerType);
  }

  public deleteReferalType(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateReferalType(employerType:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,employerType)
  }
  public unBlockReferralTypes(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}referralTypes/unblock/${id}`, data);
  }

}
