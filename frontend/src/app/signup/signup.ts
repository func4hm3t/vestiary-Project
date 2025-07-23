import { Component }            from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, SignupPayload } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  signupModel = {
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    privacy:         false
  };
  errorMsg: string | null = null;

  constructor(
    private auth:   AuthService,
    private router: Router
  ) {}

  onSubmit(form: any) {
    this.errorMsg = null;
    if (form.invalid || this.signupModel.password !== this.signupModel.confirmPassword) {
      return;
    }
    const payload: SignupPayload = {
      username: this.signupModel.username,
      email:    this.signupModel.email,
      password: this.signupModel.password,
      privacy:  this.signupModel.privacy
    };
    this.auth.signup(payload).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        // backend döndürdüğü error alanını alıyoruz
        this.errorMsg = err.error?.error || 'Kayıt sırasında hata oluştu.';
      }
    });
  }
}
