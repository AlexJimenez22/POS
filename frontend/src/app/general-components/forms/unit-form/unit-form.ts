import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Unit } from '../../../models/database/Unit';
import { DTO_UnitCreate } from '../../../models/DTOs/DTO_UnitCreate';
import { FormsModule, NgForm } from '@angular/forms';
import { TableModule } from "primeng/table";
import { InputText } from "primeng/inputtext";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Button } from "primeng/button";
import { UnitService } from '../../../services/unit.service';
import { ToastService } from '../../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-unit-form',
  imports: [FormsModule, TableModule, InputText, ToggleSwitchModule, Button],
  templateUrl: './unit-form.html',
  styleUrl: './unit-form.scss',
})
export class UnitForm implements OnChanges {

  @ViewChild("formData") formData!: NgForm;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['unit']){
      if(this.unit){
        this.unitCreate = {
          name: this.unit.name,
          abbreviation: this.unit.abbreviation,
          enable: this.unit.enable ?? true 
        } 
      } else {
        this.resetFormStructure();
      }
    }
  }

  @Input() unit: Unit | null = null;
  @Output() onSuccess = new EventEmitter();
  unitService = inject(UnitService);
  toastService = inject(ToastService);

  unitCreate:  DTO_UnitCreate = {
    name: '',
    abbreviation: '',
    enable: true
  }

  resetFormStructure() {
    this.unitCreate = {
      name: '',
      abbreviation: '',
      enable: true
    };
    this.formData?.resetForm(this.unitCreate); 
  }

  addNewUnit(){
    if(this.formData.invalid){
      this.formData.control.markAllAsTouched();
      return;
    }

    this.unitService.postNewUnit(this.unitCreate).subscribe({
      next: (res) => {
        if(!res.success){
          this.toastService.showToast("error", "Unit", res.message);
          return;
        }

        this.toastService.showToast("success", "Unit", res.message);
        this.onSuccess.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "Unit", error.error.message);
      }
    });
  }

  putUnit(){
    if(this.formData.invalid){
      this.formData.control.markAllAsTouched();
      return;
    }

    if(!this.unit?.pkUnit) return;

    this.unitService.putUnit(this.unit.pkUnit, this.unitCreate).subscribe({
      next: (res) => {
        if(!res.success){
          this.toastService.showToast("error", "Unit", res.message);
          return;
        }

        this.toastService.showToast("success", "Unit", res.message);
        this.onSuccess.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "Unit", error.error.message);
      }
    });
  }
}
