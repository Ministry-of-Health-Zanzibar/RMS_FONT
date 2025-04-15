import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseUrl: string = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  public getAllCountry(): Observable<any> {
    const href = `${this.baseUrl}countries`;
    return this.http.get<any>(href);
  }
}
