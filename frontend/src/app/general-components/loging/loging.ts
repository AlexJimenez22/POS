import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DTO_Credentials } from '../../models/DTOs/DTOs_Credentials';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { TextLogo } from "../text-logo/text-logo";

@Component({
  selector: 'app-loging',
  imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, CommonModule, TextLogo],
  templateUrl: './loging.html',
  styleUrl: './loging.scss',
})
export class Loging {

  @ViewChild("formData") formData!: NgForm;


  //#region Services
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  //#endregion

  credentials: DTO_Credentials = {
    userNumber: null,
    password: ''
  }


  handleLogin(){
    if(this.formData.invalid){
      this.formData.control.markAllAsTouched();
      return;
    }

    this.authService.logingAsk(this.credentials)
      .then((res) => {
          if(!res.success){
            this.toastService.showToast('error', 'Login', res.message);
            return;
          }

          this.router.navigate(['/Core/Generate-Sale']);
          this.toastService.showToast('success', 'Login', res.message);
      });
  }

  

}