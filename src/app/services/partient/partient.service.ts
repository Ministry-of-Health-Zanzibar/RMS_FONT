import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartientService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}patients`;
  private href_insurances = `${this.baseUrl}insuarances`;

  constructor(private http: HttpClient) {}

  public getAllPartients(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public addPartient(Partient: any): Observable<any> {
    return this.http.post(this.href, Partient);
  }
 

  public getPartientById(id: any) {
    return this.http.get<any>(`${this.href}/${id}`);
  }


  public deletePatient(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updatePartient(patient:any, id:any): Observable<any>{
    return this.http.patch(`${this.href}/${id}`,patient)
  }

  public unblockPatient(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}patients/unBlock/${id}`, data);
  }

  //insurances
  public addInsurances(insurance: any): Observable<any> {
    return this.http.post(this.href_insurances, insurance);
  }

  public uploadInsurances(insurance: any): Observable<any> {
    const req = new HttpRequest('POST', this.href_insurances, insurance, {
      reportProgress: true // Enable progress tracking
    });
    return this.http.request(req)
      .pipe(
        tap(event => {
          if (event.type === HttpEventType.UploadProgress) {
            // Calculate and log progress percentage
            if (event.total) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
            }
          } else if (event.type === HttpEventType.Response) {
          }
        })
      )
  }


}

