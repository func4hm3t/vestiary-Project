import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenService, Product } from './men.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { FavoriteService } from '../services/favorite.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-men',
  imports: [RouterModule, CommonModule],
  templateUrl: './men.html',
  styleUrls: ['./men.css'],
  encapsulation: ViewEncapsulation.None
})
export class Men implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  toastMessage: string | null = null;

  constructor(private menService: MenService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private router: Router,
    private toast: ToastService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.menService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('ürün yükleme hatası', err);
        this.error = 'ürünler yüklenmedi';
        this.loading = false;
      }
    })
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
