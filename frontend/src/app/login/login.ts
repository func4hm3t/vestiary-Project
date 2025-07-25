// src/app/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoginResp } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,            // ① BILEŞENİ STANDALONE OLARAK İŞARETLE
  imports: [
    CommonModule,              // *ngIf, *ngFor için
    FormsModule,               // ngModel, NgForm için
    RouterModule               // routerLink ve Router.navigate için
  ],
  providers: [AuthService],  // ② AuthService’i bu component’in injector’ına ekle
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials = { username: '', password: '' };
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(c => c.markAsTouched());
      return;
    }
    this.auth.login(this.credentials.username, this.credentials.password)
      .subscribe({
        next: res => {
          this.auth.saveSession(res);
          if (res.role === 'admin') {
            // admin’sen Express’in dashboard.html’ini getirir
            window.location.href = 'http://localhost:3000/dashboard';
          } else {
            // user’sen Angular’ın ana sayfasına
            this.router.navigate(['/']);
          }
        },
        error: err => {
          this.errorMsg = err.error?.error || 'Giriş başarısız.';
        }
      });
  }
}
