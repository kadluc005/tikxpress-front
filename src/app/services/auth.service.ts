import { HttpClient, HttpParams } from '@angular/common/http';
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

  clearCurrentUser(): void {
    this.currentUserValue = null;
    localStorage.removeItem('currentUser');
  }

  
}
