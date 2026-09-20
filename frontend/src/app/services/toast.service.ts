import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  
  constructor(private messageService: MessageService){}

  showToast(
    severity: 'success' | 'error' | 'warn' | 'info',
    summary: string,
    detail: string
  ){
    this.messageService.add({
      severity,
      summary,
      detail
    });
  }
}
