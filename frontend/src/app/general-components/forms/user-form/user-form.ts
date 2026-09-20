import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DTO_UserCreate } from '../../../models/DTOs/DTO_UserCreate';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { Button } from "primeng/button";
import { User } from '../../../models/database/User';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, InputTextModule, ToggleSwitchModule, SelectModule, Button],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnChanges {
  @ViewChild("formData") formData!: NgForm;

  @Input() user: User | null = null;
  @Output() onSuccess = new EventEmitter();

  userService = inject(UserService);
  toastService = inject(ToastService);

  userCreate: DTO_UserCreate = {
    name: '',
    lastname: '',
    mail: '',
    role: '',
    enable: true
  }

  roles = [
    { name: "Administrador", value: "admin" },
    { name: "Empleado", value: "employee" }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      if (this.user) {
        this.userCreate = {
          name: this.user.name,
          lastname: this.user.lastname,
          mail: this.user.mail,
          role: this.user.role,
          enable: this.user.enable ?? true 
        }; 
      } else { 
        this.resetFormStructure();
      }
    }
  }

  resetFormStructure() {
    this.userCreate = {
      name: '',
      lastname: '',
      mail: '',
      role: '',
      enable: true
    };
    this.formData?.resetForm(this.userCreate); 
  }

  addNewUser() {
    if(this.formData.invalid){
      this.formData.control.markAllAsTouched();
      return;
    }
    this.userService.postNewUser(this.userCreate).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toastService.showToast("error", "User", res.message);
          return; 
        }

        this.toastService.showToast("success", "User", res.message);
        this.onSuccess.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "User", error.error.message);
      }
    });
  }

  updateUser() {
    if(this.formData.invalid){
      this.formData.control.markAllAsTouched();
      return;
    }

    if(!this.user?.pkUser) return;
    
    this.userService.updateUser( this.user?.pkUser , this.userCreate).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toastService.showToast("error", "User", res.message);
          return; 
        }

        this.toastService.showToast("success", "User", res.message);
        this.onSuccess.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast("error", "User", error.error.message);
      }
    });
 } 
}