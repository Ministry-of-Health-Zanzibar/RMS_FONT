import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}referrals`;
  private bill = `${this.baseUrl}bills`;
   private comment = `${this.baseUrl}referralLetters/comment/referral`;
  private href_withBill = `${this.baseUrl}referralwithbills`;
  private href_letter = `${this.baseUrl}referralLetters`;



  constructor(private http: HttpClient) {}

  public addReferralLetter(referral: any): Observable<any> {
    return this.http.post(this.href_letter,referral);
  }

  public getAllRefferal(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getReferralById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addReferral(referral: any): Observable<any> {
    return this.http.post(this.href,referral);
  }

  public deleteReferral(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateReferral(referral:any, id:any): Observable<any>{
    return this.http.patch(`${this.href}/${id}`,referral)
  }

  public unblockReferral(id: any): Observable<any> {
    return this.http.patch(`${this.href}/unBlock/${id}`, {});
  }

  //referral with bills

  public getReferralwithBills(): Observable<any> {
    return this.http.get<any>(this.href_withBill);
  }

   public getBillById(id: any): Observable<any> {
    return this.http.get<any>(`${this.bill}/${id}`);
  }

   public getCommentById(id: any): Observable<any> {
    return this.http.get<any>(`${this.comment}/${id}`);
  }





}
