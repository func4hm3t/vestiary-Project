// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Ürün tiplerin; Erkek/Kadin modellerinin TypeScript arabirimleri
export interface Product {
  Id: string;
  Title: string;
  Description?: string;
  Price: number;
  ImageUrl?: string;
  beden?: string;
  renk?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = '/api/products';  // Node.js tarafı route’un prefix’ine göre ayarla

  constructor(private http: HttpClient) {}

  /** Erkek veya kadın ürünlerini beden/renk filtresiyle getirir */
  getAll(
    category: 'erkek' | 'kadin',
    beden?: string,
    renk?: string
  ): Observable<Product[]> {
    let params = new HttpParams();
    if (beden) params = params.set('beden', beden);
    if (renk)  params = params.set('renk', renk);
    return this.http.get<Product[]>(`${this.baseUrl}/${category}`, { params, withCredentials:true });
  }

  /** Yalnızca distinct beden değerlerini döner */
  getSizes(category: 'erkek' | 'kadin'): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${category}/sizes`);
  }

  /** Yalnızca distinct renk değerlerini döner */
  getColors(category: 'erkek' | 'kadin'): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${category}/colors`);
  }
}
