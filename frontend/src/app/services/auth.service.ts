import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResp {
  ok: boolean;
  role?: 'user' | 'admin';
  redirect?: string;
  error?: string;
  token?: string;
  username?: string;
}
export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  privacy: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/auth';    // proxy.conf.json veya provideHttpClient ile /auth backend'e yönlendirin
  private _role: 'user' | 'admin' | null = null;
  private _username: string | null = null;

  constructor(private http: HttpClient) { }

  signup(data: SignupPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data, { withCredentials: true });
  }

  login(username: string, password: string) {
    return this.http.post<{ username: string; role: string }>(
      `${this.baseUrl}/login`,
      { username, password }
    );
  }


  saveSession(res: { username: string; role: string }) {
    localStorage.setItem('username', res.username);
    localStorage.setItem('role', res.role);
  }
  clearSession() {
    localStorage.clear();
  }
  get username(): string | null {
    return localStorage.getItem('username');
  }
  get isLogged(): boolean {
    return !!localStorage.getItem('role');
  }

  get role(): string | null {
    return localStorage.getItem('role');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isAdmin(): boolean {
    return this._role === 'admin';
  }

  isLoggedIn(): boolean {
    return !!(this._role ?? localStorage.getItem('role'));
  }
  logout() {
    this._role = null;
    this._username = null;
    localStorage.clear();
    // istersen backend’e logout isteği de tetikleyebilirsin
  }
}
