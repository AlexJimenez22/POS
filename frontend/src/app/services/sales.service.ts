import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DTO_AlertStockProduct } from '../models/DTOs/DTO_AlertStockProduct';
import { DTO_TopProduct } from '../models/DTOs/DTO_TopProduct';
import { DTO_Sale } from '../models/DTOs/DTO_Sale';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  apiUrl: string = environment.apiUrl + "/BusinessAnalyst";
  constructor(private http: HttpClient){}

  getResumeToday(): Observable<{success: boolean, totalSalesToday?: number, totalAmountSalesToday?: number, message: string }>{
    return this.http.get<{success: boolean, totalSalesToday?: number, totalAmountSalesToday?: number, message: string }>(`${this.apiUrl}/get-resumeToday`);
  }

  getProductMetrics(): Observable<{success: boolean, alertStock?: DTO_AlertStockProduct[], topProducts?: DTO_TopProduct[], message: string  }>{
    return this.http.get<{success: boolean, alertStock?: DTO_AlertStockProduct[], topProducts?: DTO_TopProduct[], message: string  }>(`${this.apiUrl}/get-productMetrics`);
  }

  getSalesByRange(initDate: string, endDate: string): Observable<{ success: boolean, data?: DTO_Sale[], message: string }> {
    return this.http.get<{ success: boolean, data?: DTO_Sale[], message: string }>(
      `${this.apiUrl}/get-salesByRange?initDate=${initDate}&endDate=${endDate}`
    );
  }
}
