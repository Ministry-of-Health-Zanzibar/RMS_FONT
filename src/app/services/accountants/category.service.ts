import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl: string = `${environment.baseUrl}`;
  private href = `${this.baseUrl}categories`;

  constructor(private http: HttpClient) {}

  public getAllCategory(): Observable<any> {
    return this.http.get<any>(this.href);
  }

  public getCategoryById(id: any): Observable<any> {
    return this.http.get<any>(`${this.href}/${id}`);
  }

  public addCategory(Category: any): Observable<any> {
    return this.http.post(this.href, Category);
  }

  public deleteCategory(id:any): Observable<any>{
    return this.http.delete(`${this.href}/${id}`);
  }

  public updateCategory(Category:any, id:any): Observable<any>{
    return this.http.put(`${this.href}/${id}`,Category)
  }

  public unblockCategory(data: any, id:any): Observable<any>{
    return this.http.patch(`${this.baseUrl}categories/unBlock/${id}`, data);
  }


}