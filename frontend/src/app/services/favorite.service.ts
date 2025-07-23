import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favIds = new Set<string>();

  add(product: { Id: string }): void {
    this.favIds.add(product.Id);
    console.log('Favorilere eklendi:', product.Id);
  }

  remove(id: string): void {
    this.favIds.delete(id);
    console.log('Favorilerden çıkarıldı:', id);
  }

  isFavorited(id: string): boolean {
    return this.favIds.has(id);
  }

  getFavorites(): string[] {
    return Array.from(this.favIds);
  }
}
