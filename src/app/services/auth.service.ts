import { Inject, inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Role, SignupData, SignupResponse, UserResponse } from '../model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  constructor(@Inject('API_URL') private apiUrl: string) {}

  isAuthenticated(): boolean {
    const authToken = localStorage.getItem('auth_token');
    return authToken ? true : false;
  }

  login(username: string, password: string): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`${this.apiUrl}/api/login`, { username, password })
      .pipe(tap((response) => response));
  }

  signup(userData: SignupData): Observable<SignupResponse> {
    return this.http
      .post<SignupResponse>(`${this.apiUrl}/api/users`, {
        ...userData,
        role: Role.USER,
      })
      .pipe(tap((response) => response));
  }

  authenticated(id: string) {
    localStorage.setItem('auth_token', id);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
