import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  getDecodedToken(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const decoded: { name: string } = this.getDecodedToken(token);
    return decoded?.name || null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
