import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/database/Product';
import { ToastService } from '../../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectModule } from "primeng/select";
import { DTO_GenerateSale } from '../../../models/DTOs/DTO_GenerateSale';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SaleService } from '../../../services/sale.service';

@Component({
  selector: 'app-generate-sale',
  imports: [SelectModule, FormsModule, CurrencyPipe],
  templateUrl: './generate-sale.html',
  styleUrl: './generate-sale.scss',
})
export class GenerateSale implements OnInit, AfterViewInit {
  @ViewChild("formData") formData!: NgForm;
  // Inyectamos la referencia del input para obligar el Focus
  @ViewChild("barcodeSearch") barcodeSearchInput!: ElementRef<HTMLInputElement>;

  productsService = inject(ProductService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  saleService = inject(SaleService);
  
  products_$ = signal<Product[]>([]);
  
  subtotal: number = 0;
  totalDiscount: number = 0;
  receivedAmount: number | null = null;
  changeAmount: number = 0;

  saleCreate: DTO_GenerateSale = {
    fkUser: null,
    total: null,
    items: [
      {
        fkProduct: null,
        quantity: 1, // Inicializamos en 1 para evitar problemas con operaciones matemáticas
        discount: 0,
        totalItem: 0,
        unitPrice: 0
      }
    ]
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  // Se ejecuta automáticamente al terminar de renderizar la vista
  ngAfterViewInit(): void {
    this.focusBarcodeReader();
  }

  // Función dedicada a mandar el cursor al campo de lectura
  focusBarcodeReader() {
    if (this.barcodeSearchInput) {
      setTimeout(() => {
        this.barcodeSearchInput.nativeElement.focus();
      }, 50);
    }
  }

  loadProducts() {
    this.productsService.getAllProductsEnable().subscribe({
      next: (res) => {
        if (!res.success || !res.data) {
          this.toastService.showToast("error", "Productos", res.message);
          this.products_$.set([]);
          return;
        }
        this.products_$.set(res.data);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "Productos", error.error.message);
        this.products_$.set([]);
      }
    });
  }

  // LÓGICA MÁGICA DEL ESCÁNER DE CÓDIGO DE BARRAS
  onBarcodeScanned(code: string) {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    // 1. Buscamos el producto en la lista que nos trajimos del Backend
    // Asumo que tu modelo Product tiene la propiedad 'barCode' o 'serialNumber'
    const matchingProduct = this.products_$().find(
      p => p.serialNumber === cleanCode
    );

    // Si el producto no existe en el catálogo backend, Toast de error inmediato
    if (!matchingProduct) {
      this.toastService.showToast("error", "Escáner", `Producto no encontrado con el código: ${cleanCode}`);
      this.focusBarcodeReader();
      return;
    }

    // 2. Buscamos si el producto ya está puesto en las filas actuales del carrito de venta
    const existingItem = this.saleCreate.items.find(item => item.fkProduct === matchingProduct.pkProduct);

    if (existingItem) {
      // Caso A: Ya estaba en la pantalla, así que le sumamos 1 a su cantidad existente
      existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
      // Caso B: Es un producto válido nuevo. Evaluamos la primera fila por defecto
      if (this.saleCreate.items.length === 1 && this.saleCreate.items[0].fkProduct === null) {
        // Si la primera fila está vacía, la llenamos directamente con este producto
        this.saleCreate.items[0].fkProduct = matchingProduct.pkProduct;
        this.saleCreate.items[0].quantity = 1;
        this.saleCreate.items[0].discount = 0;
      } else {
        // Si ya hay cosas, inyectamos un nuevo renglón exitoso directamente
        this.saleCreate.items.push({
          fkProduct: matchingProduct.pkProduct,
          quantity: 1,
          discount: 0,
          totalItem: 0,
          unitPrice: matchingProduct.price
        });
      }
    }

    // Recalculamos totales automáticamente y regresamos foco
    this.calculateTotals();
    this.focusBarcodeReader();
  }

  addItem() {
    this.saleCreate.items.push({
      fkProduct: null,
      quantity: 1,
      discount: 0,
      totalItem: 0,
      unitPrice: 0
    });
    this.focusBarcodeReader();
  }

  removeItem(index: number) {
    if (this.saleCreate.items.length > 1) {
      this.saleCreate.items.splice(index, 1);
      this.calculateTotals();
    }
    this.focusBarcodeReader();
  }

  calculateTotals() {
    this.subtotal = 0;
    this.totalDiscount = 0;

    this.saleCreate.items.forEach((item) => {
      const product = this.products_$().find(u => u.pkProduct == item.fkProduct);
      if (!product || item.quantity === null || item.quantity < 0) {
        item.totalItem = 0;
        return;
      }

      const itemGross = product.price * item.quantity;
      const itemDiscount = itemGross * ((item.discount || 0) / 100);
      
      item.totalItem = itemGross - itemDiscount;
      item.unitPrice = product.price;

      this.subtotal += itemGross;
      this.totalDiscount += itemDiscount;
    });

    this.saleCreate.total = this.subtotal - this.totalDiscount;
    this.calculateChange();
  }

  calculateChange() {
    const total = this.saleCreate.total || 0;
    if(!this.receivedAmount) {
      this.changeAmount = 0;
      return;
    }
    if (this.receivedAmount >= total) {
      this.changeAmount = this.receivedAmount - total;
    } else {
      this.changeAmount = 0;
    }
  }

  processSale() {
    if (this.formData.invalid || !this.receivedAmount || this.receivedAmount < (this.saleCreate.total || 0)) return;

    if (!this.authService.userLoging_$()?.pkUser) return;

    const currentUser = this.authService.userLoging_$();

    const payload: DTO_GenerateSale = {
      ...this.saleCreate,
      fkUser: currentUser!.pkUser,
      receivedAmount: this.receivedAmount,
      discountAmount: this.totalDiscount,
      subtotal: this.subtotal, 
      changeAmount: this.changeAmount
    };

    this.saleService.postNewSale(payload).subscribe({
      next: (res) => {
        if(!res.success){
          this.toastService.showToast("error", "Venta", res.message);
          return;
        }

        this.cleanForm();
        this.toastService.showToast("success", "Venta", res.message);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "Venta", error.error.message);
      }
    });
  }

  cleanForm(){
    this.formData.resetForm();
    this.loadProducts();
    this.subtotal = 0;
    this.totalDiscount = 0;
    this.receivedAmount = 0;
    this.changeAmount = 0;
    this.saleCreate = {
      fkUser: null,
      total: null,
      items: [
        {
          fkProduct: null,
          quantity: 1,
          discount: 0,
          totalItem: 0,
          unitPrice: 0
        }
      ]
    };
    // Regresamos el foco al limpiar la pantalla para la siguiente venta
    this.focusBarcodeReader();
  }

  getUnit(idProduct: number | null) : string{
    if(!idProduct) return '';
    const product = this.products_$().find(q => q.pkProduct === idProduct);
    if(!product || !product.unit) return '';
    return product.unit?.abbreviation;
  }
}