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

// src/app/women/women.service.ts
@Injectable({ providedIn: 'root' })
export class WomenService {
  private readonly baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  getProducts(sizes: string[] = [], colors: string[] = []): Observable<Product[]> {
    let params = new HttpParams();
    if (sizes.length)  params = params.set('beden', sizes.join(','));
    if (colors.length) params = params.set('renk',  colors.join(','));
    return this.http.get<Product[]>(
      `${this.baseUrl}/kadin`,
      { params }
    );
  }

  getSizes(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/kadin/sizes`
    );
  }

  getColors(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/kadin/colors`
    );
  }
}
