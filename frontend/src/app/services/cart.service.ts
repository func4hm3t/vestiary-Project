import { Injectable } from '@angular/core';
import { Product } from '../women/women.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: Product[] = [];

  add(product: Product): void {
    this.items.push(product);
    console.log('Sepete eklendi:', product);
  }

  remove(id: string): void {
    this.items = this.items.filter(p => p.Id !== id);
    console.log('Sepetten çıkarıldı:', id);
  }

  getItems(): Product[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}
