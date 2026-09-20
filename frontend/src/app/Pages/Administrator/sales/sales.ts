import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { SalesService } from '../../../services/sales.service';
import { ToastService } from '../../../services/toast.service';
import { DatePipe, DecimalPipe, JsonPipe } from '@angular/common';
import { DTO_AlertStockProduct } from '../../../models/DTOs/DTO_AlertStockProduct';
import { DTO_TopProduct } from '../../../models/DTOs/DTO_TopProduct';
import { DTO_Sale } from '../../../models/DTOs/DTO_Sale';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  imports: [DecimalPipe, FormsModule, DatePipe],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class Sales implements OnInit {

  ngOnInit(): void {
    this.loadResumeToday();
    this.loadProductMertrics();
  }

  //Services
  salesService = inject(SalesService);
  toastService = inject(ToastService);

  resumeToday_$ = signal<{totalSalesToday: number, totalAmountSalesToday: number} | null>(null);
  alertStock_$ = signal<DTO_AlertStockProduct[]>([]);
  topProducts_$ = signal<DTO_TopProduct[]>([]);
  sales_$ = signal<DTO_Sale[]>([]);

  constructor(){
    effect(() => {
      const start = this.initDate_$();
      const end = this.endDate_$();

      this.loadSalesByRange();
    });
  }

  loadResumeToday(){
    this.salesService.getResumeToday().subscribe({
      next: (res) => {
        if(!res.success){
          this.toastService.showToast("error", "Resumen del dia", res.message);
          return;
        }

        this.resumeToday_$.set({
          totalAmountSalesToday: res.totalAmountSalesToday!,
          totalSalesToday: res.totalSalesToday!
        });
      }
    });
  }

  loadProductMertrics(){
    this.salesService.getProductMetrics().subscribe({
      next: (res) => {
        if(!res.success){
          this.toastService.showToast("error", "Resumen del dia", res.message);
          return;
        }

        this.alertStock_$.set(res.alertStock!);
        this.topProducts_$.set(res.topProducts!);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "Resumen del dia", error.error.message);
      }
    });
  }

  private todayStr = this.getLocalDateString();
  initDate_$ = signal<string>(this.todayStr);
  endDate_$ = signal<string>(this.todayStr);
  private getLocalDateString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    
    return `${year}-${month}-${day}`;
  }

  loadSalesByRange(){
    console.log(this.initDate_$());
    console.log(this.endDate_$());
    this.salesService.getSalesByRange(this.initDate_$(), this.endDate_$()).subscribe({
      next: (res) => {
        if(!res.success){
          this.toastService.showToast("error", "Resumen del dia", res.message);
          return;
        }

        this.sales_$.set(res.data!);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "Resumen del dia", error.error.message);
      }
    });
  }




}
