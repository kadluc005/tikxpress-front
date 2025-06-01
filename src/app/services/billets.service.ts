import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Billet, CreateBilletDto, CreateTypeBilletDto, TypeBillets, UpdateTypeBilletDto } from '../models/type-billets';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BilletsService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = environment.BASE_API_URL + 'type-billet/';
  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createBillet(jwtToken: string, createTypeBilletDto: CreateTypeBilletDto): Observable<TypeBillets>{
    const headers = this.getAuthHeaders(jwtToken);
    return this.httpClient.post<TypeBillets>(this.baseUrl, createTypeBilletDto, { headers: headers });
  }

  bookBillet(jwtToken:string, dto: CreateBilletDto): Observable<Billet>{
    const headers = this.getAuthHeaders(jwtToken);
    return this.httpClient.post<Billet>(this.baseUrl + 'billet', dto, { headers: headers })
    
  }

  updateBillet(id: number, updateTypeBilletDto: UpdateTypeBilletDto): Observable<TypeBillets> {
    return this.httpClient.patch<TypeBillets>(this.baseUrl + id, updateTypeBilletDto);
  }

  deleteBillet(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + id);
  }
  getBilletById(id: number): Observable<TypeBillets> {
    return this.httpClient.get<TypeBillets>(this.baseUrl + id);
  }

  findEventBillet(id: number): Observable<TypeBillets[]>{
    return this.httpClient.get<TypeBillets[]>(this.baseUrl + 'event/' + id);
  }
}
