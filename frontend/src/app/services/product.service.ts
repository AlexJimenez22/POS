import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Product } from '../models/database/Product';
import { DTO_ProductCreate } from '../models/DTOs/DTO_ProductCreate';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient){}
  apiUrl = environment.apiUrl + '/Product';

  getAllProducts(): Observable<{success: boolean, message: string, data?: Product[]}>{
    return this.http.get<{success: boolean, message: string, data?: Product[]}>(`${this.apiUrl}/get-allProducts`);
  }

  getAllProductsEnable(): Observable<{success: boolean, message: string, data?: Product[]}>{
    return this.http.get<{success: boolean, message: string, data?: Product[]}>(`${this.apiUrl}/get-allProductsEnable`);
  }

  postNewProduct( product: DTO_ProductCreate): Observable<{success: boolean, message: string}>{
    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/post-newProduct`, product );
  }

  putProduct(idProduct: number, product: DTO_ProductCreate): Observable<{success: boolean, message: string}>{
    return this.http.put<{success: boolean, message: string}>(`${this.apiUrl}/put-product/${idProduct}`, product);
  }
  
}
