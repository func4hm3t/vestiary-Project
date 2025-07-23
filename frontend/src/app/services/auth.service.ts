import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignupPayload {
  username: string;
  email:    string;
  password: string;
  privacy:  boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/auth';    // proxy.conf.json veya provideHttpClient ile /auth backend'e yönlendirin

  constructor(private http: HttpClient) { }

  signup(data: SignupPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }
  login(username: string, password: string) {
    return this.http.post<{ token: string; username: string }>(
      `${this.baseUrl}/login`,
      { username, password }
    );
  }

  saveSession(res: { token: string; username: string }) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.username);
  }
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.clear();
  }
  get username(): string | null {
    return localStorage.getItem('username');
  }
  get isLogged(): boolean {
    return !!localStorage.getItem('token');
  }
   getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
