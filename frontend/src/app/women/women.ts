// src/app/women/women.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WomenService, Product } from './women.service';
import { CartService } from '../services/cart.service';
import { FavoriteService } from '../services/favorite.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-women',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './women.html',
  styleUrls: ['./women.css'],
  encapsulation: ViewEncapsulation.None
})
export class Women implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  toastMessage: string | null = null;

  sizes: string[] = [];
  filteredSizes: string[] = [];
  selectedSizes: string[] = [];
  sizeSearch = '';

  colors: string[] = [];
  filteredColors: string[] = [];
  selectedColors: string[] = [];
  colorSearch = '';

  constructor(
    private womenService: WomenService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private router: Router,
    private toast: ToastService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {

    this.womenService.getSizes().subscribe(rawSizes => {
      // 1) Her bir string'i virgülden parçala, 
      // 2) boşlukları kırp, 
      // 3) düzleştir (flat), 
      // 4) Set ile tekilleştir
      const all = rawSizes
        .flatMap(s => s.split(','))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      this.sizes = Array.from(new Set(all));
      this.filteredSizes = [...this.sizes];
    });
    this.womenService.getColors().subscribe(rawColors => {
      const all = rawColors
        .flatMap(c => c.split(','))
        .map(c => c.trim())
        .filter(c => c.length > 0);
      this.colors = Array.from(new Set(all));
      this.filteredColors = [...this.colors];
    });

    this.loadProducts();

  }


  private loadProducts() {
    this.loading = true;
    this.womenService
      .getProducts(
        this.selectedSizes,
        this.selectedColors
      )

      .subscribe({
        next: data => {
          this.products = data;
          this.loading = false;
        },
        error: err => {
          console.error('Ürün yükleme hatası', err);
          this.error = 'Ürünler yüklenemedi';
          this.loading = false;
        }
      });
  }

  // Arama kutularını filtrelemek için
  onSizeSearchChange() {
    const q = this.sizeSearch.toLowerCase();
    this.filteredSizes = this.sizes.filter(s => s.toLowerCase().includes(q));
  }
  onColorSearchChange() {
    const q = this.colorSearch.toLowerCase();
    this.filteredColors = this.colors.filter(c => c.toLowerCase().includes(q));
  }

  // Checkbox tıklanınca diziye ekle/çıkar ve yeniden yükle
  onSizeToggle(size: string, checked: boolean) {
    if (checked) this.selectedSizes.push(size);
    else this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    this.loadProducts();
  }
  onColorToggle(color: string, checked: boolean) {
    if (checked) this.selectedColors.push(color);
    else this.selectedColors = this.selectedColors.filter(c => c !== color);
    this.loadProducts();
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
