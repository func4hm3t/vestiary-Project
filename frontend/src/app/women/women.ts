// src/app/women/women.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WomenService, Product } from './women.service';
import { CartService } from '../services/cart.service';
import { FavoriteService } from '../services/favorite.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './women.html',
  styleUrls: ['./women.css'],
  encapsulation: ViewEncapsulation.None
})
export class Women implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  toastMessage: string | null = null;

  constructor(
    private womenService: WomenService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private router: Router,
    private toast: ToastService,
    private auth : AuthService
  ) { }

  ngOnInit(): void {
    this.womenService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ürün yükleme hatası', err);
        this.error = 'Ürünler yüklenemedi';
        this.loading = false;
      }
    });
  }
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  toggleCart(product: Product): void {
    if (!this.isLoggedIn()) {
      this.showToast('🔒 Lütfen giriş yapınız');
      return;
    }
    if (this.isInCart(product)) {
      this.cartService.remove(product.Id);
      this.showToast('🗑️ Sepetten çıkarıldı');
    } else {
      this.cartService.add(product);
      this.showToast('🛒 Sepete eklendi');
    }
  }

  toggleFavorite(product: Product): void {
    if (!this.isLoggedIn()) {
      this.showToast('🔒 Lütfen giriş yapınız');
      return;
    }
    if (this.favoriteService.isFavorited(product.Id)) {
      this.favoriteService.remove(product.Id);
      this.showToast('💔 Favorilerden çıkarıldı');
    } else {
      this.favoriteService.add(product);
      this.showToast('❤️ Favorilere eklendi');
    }
  }

  isFavorite(product: Product): boolean {
    return this.favoriteService.isFavorited(product.Id);
  }

  private showToast(msg: string) {
    console.log('✨ TOAST TETİKLENDİ ➡', msg);
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = null, 3000);
  }

  isInCart(product: Product): boolean {
    return this.cartService.getItems().some(item => item.Id === product.Id);
  }

}
