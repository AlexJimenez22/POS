import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Unit } from '../../../models/database/Unit';
import { UnitService } from '../../../services/unit.service';
import { UnitForm } from "../../../general-components/forms/unit-form/unit-form";


@Component({
  selector: 'app-units',
  imports: [
    IconFieldModule,
    InputIconModule,
    TableModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    DatePipe,
    UnitForm
],
  templateUrl: './units.html',
  styleUrl: './units.scss',
})
export class Units implements OnInit {

  ngOnInit(): void {
    this.loadUnits()
  }

  showModal: boolean = false;
  titleModal: string = "Default Title";
  unitSelected: Unit | null = null;
  unitService = inject(UnitService);
  toastService = inject(ToastService);

  units_$ = signal<Unit[]>([]);

  handleSuccess() {
    this.unitSelected = null;
    this.loadUnits();
    this.showModal = false;
  }

  onRowSelect(event: any) {
    this.titleModal = "Editar unidad";
    this.showModal = true;
  }

  loadUnits(){
    this.unitService.getAllUnits().subscribe({
      next: (res) => {
        if(!res.success || !res.data){
          this.toastService.showToast("error", "Units", res.message);
          this.units_$.set([]);
          return;
        }
        this.units_$.set(res.data);
        
      },
      error: (error: HttpErrorResponse) => {
          this.toastService.showToast("error", "Units", error.error.message);
          this.units_$.set([]);
      }
    })
  }

}
