import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule , Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/']);
  }
}
