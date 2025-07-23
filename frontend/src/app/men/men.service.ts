// src/app/men/men.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  Id: string;
  Title: string;
  Description: string;
  Price: number;
  ImageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenService {
  private apiUrl = '/products/erkek';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
