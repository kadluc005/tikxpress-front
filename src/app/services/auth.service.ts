import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Auth, LoginResponse, RegisterDto, User } from '../models/user';
import { Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserValue: Auth | null = null;
  constructor(private http: HttpClient) {}

  basUrl = environment.BASE_API_URL + 'auth/';
  baseUrlRole = environment.BASE_API_URL + 'role';
  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  register(user: RegisterDto, userRole: string) {
    const params = new HttpParams().set('role', userRole);
    return this.http.post(this.basUrl + 'register', user, { params });
  }

  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.basUrl + 'login',
      user
    );
  }

  getUserRoles(id: number): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.baseUrlRole}/user/${id}/role`);
  }

  // Méthodes pour gérer l'utilisateur courant
  setCurrentUser(user: Auth): void {
    this.currentUserValue = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): Auth | null {
    if (!this.currentUserValue) {
      const user = localStorage.getItem('currentUser');
      this.currentUserValue = user ? JSON.parse(user) : null;
    }
    return this.currentUserValue;
  }
  getCurrentUserFromToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = token.split('.')[1];
    try {
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur de décodage du token :', error);
      return null;
    }
  }

  clearCurrentUser(): void {
    this.currentUserValue = null;
    localStorage.removeItem('currentUser');
  }

  findUserById(token: string, id: number): Observable<Auth> {
    const header = this.getAuthHeaders(token);
    return this.http.get<Auth>(`${this.basUrl}${id}`, { headers: header });
  }

  getAllUsers(token: string): Observable<Auth[]> {
    const header = this.getAuthHeaders(token);
    return this.http.get<Auth[]>(this.basUrl, { headers: header });
  }
  
}
