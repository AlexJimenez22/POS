import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { Product } from '../../../models/database/Product';
import { DTO_ProductCreate } from '../../../models/DTOs/DTO_ProductCreate';
import { FormsModule, NgForm } from '@angular/forms';
import { Unit } from '../../../models/database/Unit';
import { UnitService } from '../../../services/unit.service';
import { ToastService } from '../../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, TableModule, InputTextModule, SelectModule, ButtonModule, ToggleSwitchModule, InputNumberModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnChanges, OnInit {

  @ViewChild("formData") formData!: NgForm;
  @Input() product: Product | null = null;
  @Output() onSuccess = new EventEmitter();

  units_$ = signal<Unit[]>([]);
  unitService = inject(UnitService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  productService = inject(ProductService);
  user = this.authService.userLoging_$;

  productCreate: DTO_ProductCreate = {
    name: '',
    serialNumber: '',
    quantity: null as any,
    minQuantity: null as any,
    price: null as any,
    minPrice: null as any,
    enable: true,
    fkUnit: null as any
  }

  ngOnInit(): void {
    this.loadUnits();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['product']){
      if(this.product){
        this.productCreate = {
          serialNumber: this.product.serialNumber,
          name: this.product.name,
          quantity: this.product.quantity,
          minQuantity: this.product.minQuantity,
          price: this.product.price,
          minPrice: this.product.minPrice,
          enable: this.product.enable,
          fkUnit: this.product.unit?.pkUnit ?? undefined
        }
      } else {
        this.resetFormStructure();
      }
    }
  }

  resetFormStructure() {
    this.productCreate = {
      name: '',
      serialNumber: '',
      quantity: null as any,
      minQuantity: null as any,
      price: null as any,
      minPrice: null as any,
      enable: true,
      fkUnit: null as any
    };
    this.formData?.resetForm(this.productCreate); 
  }

  getSelectedUnitName(): string {
    const selectedUnit = this.units_$().find(u => u.pkUnit === this.productCreate.fkUnit);
    return selectedUnit ? selectedUnit.name : '';
  }

  loadUnits(){
    this.unitService.getAllUnitsEnable().subscribe({
      next: (res) => {
        if(!res.success || !res.data){
          this.toastService.showToast("error", "Units", res.message);
          this.units_$.set([]);
          return;
        }
        this.units_$.set(res.data);        
      },
      error: (error: HttpErrorResponse) => {
          this.toastService.showToast("error", "Units", error.error?.message || "Error al cargar unidades");
          this.units_$.set([]);
      }
    })
  }
  
  addNewProduct(){
    if(this.formData.invalid){
      this.formData.control.markAllAsTouched();
      return;
    }

    const currentUser = this.user();

    if (!currentUser || !currentUser.pkUser) return;

    const data = {
      ...this.productCreate,
      fkCreatedBy: currentUser.pkUser 
    };

    this.productService.postNewProduct(data).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toastService.showToast("error", "User", res.message);
          return; 
        }

        this.formData.resetForm();
        this.toastService.showToast("success", "User", res.message);
        this.onSuccess.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "User", error.error.message);
      }
    });
  }

  updateProduct(){
    if(this.formData.invalid){
      this.formData.control.markAllAsTouched();
      return;
    }

    const currentUser = this.user();

    if (!currentUser || !currentUser.pkUser) return;

    if(!this.product?.pkProduct) return;

    const idProduct = this.product.pkProduct;

    const data = {
      ...this.productCreate,
      fkUpdateddBy: currentUser.pkUser 
    };

    this.productService.putProduct(idProduct, data).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toastService.showToast("error", "User", res.message);
          return; 
        }
        this.formData.resetForm();
        this.toastService.showToast("success", "User", res.message);
        this.onSuccess.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "User", error.error.message);
      }
    });
  }
}