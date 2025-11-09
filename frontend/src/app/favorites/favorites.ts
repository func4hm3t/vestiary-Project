// src/app/favorites/favorites.component.ts
import { Component, OnInit }                          from '@angular/core';
import { CommonModule }                               from '@angular/common';
import { RouterModule, Router }                       from '@angular/router';
import { forkJoin }                                   from 'rxjs';

import { WomenService, Product as WomenProduct }      from '../women/women.service';
import { MenService,     Product as MenProduct }      from '../men/men.service';
import { FavoriteService }                            from '../services/favorite.service';
import { CartService }                                from '../services/cart.service';
import { AuthService }                                from '../services/auth.service';

type Product = WomenProduct | MenProduct;

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class Favorites implements OnInit {
  products: Product[]   = [];
  showLoginPrompt       = false;

  constructor(
    private auth:       AuthService,
    private favSvc:     FavoriteService,
    private womenSvc:   WomenService,
    private menSvc:     MenService,
    private cartSvc:    CartService,
    private router:     Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.showLoginPrompt = true;
      return;
    }

    const favIds = this.favSvc.getFavorites(); // string[]

    forkJoin({
      women: this.womenSvc.getProducts(),
      men:   this.menSvc.getProducts()
    }).subscribe({
      next: ({ women, men }) => {
        const all = [...women, ...men];
        this.products = all.filter(p => favIds.includes(p.Id));
      },
      error: err => console.error('Favori ürünler yüklenemedi', err)
    });
  }

  addToCart(p: Product) {
    this.cartSvc.add(p);
  }

  removeFavorite(p: Product) {
    this.favSvc.remove(p.Id);
    this.products = this.products.filter(x => x.Id !== p.Id);
  }
}
