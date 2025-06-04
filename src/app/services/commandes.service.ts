import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Commandes, UserCommands } from '../models/commandes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandesService {

  constructor(private httpClient: HttpClient) { }

  baseUrl = environment.BASE_API_URL + 'commande/';

  createCommande(jwtToken: string, commande: Commandes): Observable<Commandes> {
    const headers = {
      Authorization: `Bearer ${jwtToken}`
    };
    return this.httpClient.post<Commandes>(this.baseUrl, commande, { headers });
  }

  findCommandesByUserId( userId: number): Observable<UserCommands[]> {
    const url = `${this.baseUrl}commande/user/${userId}`;
    return this.httpClient.get<UserCommands[]>(url);
  }
  

}
