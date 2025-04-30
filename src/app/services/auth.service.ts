import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RegisterDto, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  basUrl = environment.BASE_API_URL + 'auth/';

  register(user: RegisterDto){
    return this.http.post(this.basUrl+ 'register', user)
  }

  login(user: User){
    return this.http.post(this.basUrl+ 'login', user);
  }

}
