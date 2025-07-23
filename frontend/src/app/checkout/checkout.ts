// src/app/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { CartService }       from '../services/cart.service';
import { Product }           from '../women/women.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
  items: Product[] = [];
  total = 0;

  constructor(private cartSvc: CartService) {}

  ngOnInit(): void {
    this.items = this.cartSvc.getItems();
    this.total = this.items.reduce((sum, p) => sum + (p.Price || 0), 0);
  }

  finish() {
    this.cartSvc.clear();
    alert('Siparişiniz alındı. Teşekkürler!');
  }
}
