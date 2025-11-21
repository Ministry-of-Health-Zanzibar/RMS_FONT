import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MedicalhistoryService {

 private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}patient-histories`;

  private baseForBoard = `${this.baseUrl}patient-lists`;



  constructor(private http: HttpClient) {}


public updateMedicals(patientHistoryId: number, medicalData: any): Observable<any> {
  const url = `${this.baseUrl}patient-histories/${patientHistoryId}/medical-board`;
  return this.http.put(url, medicalData); // send JSON
}

  public addMedical(Medical: any): Observable<any> {
    return this.http.post(this.href, Medical);
  }

  public getMedicalById(id: any) {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public deletePatients(id: any): Observable<any> {
    return this.http.delete(`${this.href}/${id}`);
  }

  public unblockPatients(data: any, id: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}patients/unBlock/${id}`, data);
  }

  public deletePatient(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}patient-lists/${id}`);
  }
  public unblockPatient(id: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}patient-lists/unblock/${id}`, {});
  }

  // public updateMedical(patient: any, id: any): Observable<any> {
  //   return this.http.post(`${this.href}/update/${id}`, patient);
  // }

  public updateMedical(patient: any, id: number): Observable<any> {
    return this.http.post(`${this.href}/update/${id}`, patient);
  }

  public updateMedicalBoard(
    patient: any,
    patient_list_id: any
  ): Observable<any> {
    return this.http.post(
      `${this.baseForBoard}/update/${patient_list_id}`,
      patient
    );
  }


}
