import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}documentForms`;

  constructor(private http: HttpClient) {}

  public getAllDocument(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getDocumentById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addDocument(Document: any): Observable<any> {
    return this.http.post(this.href, Document);
  }

  public deleteDocument(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateDocument(Document:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,Document)
  }

  public unblockDocument(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}documentForms/unBlock/${id}`, data);
  }


}

