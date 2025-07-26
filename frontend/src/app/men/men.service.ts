// src/app/men/men.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  Id: string;
  Title: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  beden?: string;
  renk?: string;
}

@Injectable({ providedIn: 'root' })
export class MenService {
  // ◀ Burada backend'in tam adresini yazıyoruz
  private readonly baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  // Erkek ürünleri listeler (opsiyonel filtre parametreleriyle)
  getProducts(
    sizes: string[] = [],
    colors: string[] = [],
    minPrice?: number,
    maxPrice?: number
  ): Observable<Product[]> {
    let params = new HttpParams();
    if (sizes.length) params = params.set('beden', sizes.join(','));
    if (colors.length) params = params.set('renk', colors.join(','));
    if (minPrice != null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice != null) params = params.set('maxPrice', maxPrice.toString());
    return this.http.get<Product[]>(
      `${this.baseUrl}/erkek`,
      { params, withCredentials:true }
    );
  }

  getSizes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/erkek/sizes`);
  }

  getColors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/erkek/colors`);
  }
}
