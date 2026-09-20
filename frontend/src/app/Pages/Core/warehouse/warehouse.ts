import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../models/database/Product';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';
import { TableModule } from "primeng/table";
import { Button, ButtonModule } from "primeng/button";
import { IconField, IconFieldModule } from "primeng/iconfield";
import { Tag, TagModule } from "primeng/tag";
import { DatePipe } from '@angular/common';
import { DialogModule } from "primeng/dialog";
import { ProductForm } from "../../../general-components/forms/product-form/product-form";
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-warehouse',
  imports: [TableModule, ButtonModule, IconFieldModule, TagModule, DatePipe, DialogModule, ProductForm, InputIconModule, InputTextModule],
  templateUrl: './warehouse.html',
  styleUrl: './warehouse.scss',
})
export class Warehouse implements OnInit {

  ngOnInit(): void {
    this.loadProducts()
  }

  showModal: boolean = false;
  titleModal: string = "Default Title";
  productSelected: Product | null = null;
  productService = inject(ProductService);
  toastService = inject(ToastService);

  products_$ = signal<Product[]>([]);

  handleSuccess() {
    this.productSelected = null;
    this.loadProducts();
    this.showModal = false;
  }

  onRowSelect(event: any) {
    this.titleModal = "Editar unidad";
    this.showModal = true;
  }

  loadProducts(){
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        if(!res.success || !res.data){
          this.toastService.showToast("error", "Units", res.message);
          this.products_$.set([]);
          return;
        }
        this.products_$.set(res.data);
        
      },
      error: (error: HttpErrorResponse) => {
          this.toastService.showToast("error", "Units", error.error.message);
          this.products_$.set([]);
      }
    })
  }

}
