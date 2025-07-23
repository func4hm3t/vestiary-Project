// src/app/shopping/shopping.component.ts
import { Component, OnInit }     from '@angular/core';
import { CommonModule }           from '@angular/common';
import { RouterModule, Router }   from '@angular/router';
import { AuthService }            from '../services/auth.service';
import { CartService }            from '../services/cart.service';
import { Product }                from '../women/women.service'; // veya ortak model

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shopping.html',
  styleUrls: ['./shopping.css']
})
export class Shopping implements OnInit {
  items: Product[] = [];
  showLoginPrompt = false;

  constructor(
    private auth:    AuthService,
    private cartSvc: CartService,
    private router:  Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.showLoginPrompt = true;
      return;
    }
    this.items = this.cartSvc.getItems();
  }

  removeFromCart(p: Product) {
    this.cartSvc.remove(p.Id);
    this.items = this.cartSvc.getItems();
  }

  get total(): number {
    return this.items.reduce((sum, p) => sum + (p.Price || 0), 0);
  }

  checkout() {
   this.router.navigate(['/shopping/checkout']);
  }
}
