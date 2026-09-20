import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DTO_GenerateSale } from '../models/DTOs/DTO_GenerateSale';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  apiUrl: string = environment.apiUrl + '/Sale';
  constructor(private http: HttpClient){}

  postNewSale( sale: DTO_GenerateSale ): Observable<{success: boolean, message: string}>{
    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/post-newSale`, sale);
  }

}
