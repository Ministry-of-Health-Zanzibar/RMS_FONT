import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}documentTypes`;

  constructor(private http: HttpClient) {}

  public getAllDocumentType(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getDocumentTypeById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addDocumentType(DocumentType: any): Observable<any> {
    return this.http.post(this.href, DocumentType);
  }

  public deleteDocumentType(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateDocumentType(DocumentType:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,DocumentType)
  }

  public unblockDocumentType(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}documentTypes/unBlock/${id}`, data);
  }


}
