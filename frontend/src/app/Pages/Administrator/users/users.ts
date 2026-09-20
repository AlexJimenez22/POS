import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../../models/database/User';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserForm } from "../../../general-components/forms/user-form/user-form";



@Component({
  selector: 'app-users',
  imports: [
    IconFieldModule,
    InputIconModule,
    TableModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    UserForm,
    DatePipe
],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {

  ngOnInit(): void {
    this.loadUsers();
  }

  userService = inject(UserService);
  toastService = inject(ToastService);

  users_$ = signal<User[]>([]);
  userSelected: User | null = null;
  showModal: boolean = false;
  titleModal: string = "Default Title";

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        if (!res.success || !res.data) {
          this.users_$.set([]);
          this.toastService.showToast('error', "Users", res.message);
          return;
        }

        this.users_$.set(res.data);
      },
      error: (error: HttpErrorResponse) => {
          this.users_$.set([]);
          this.toastService.showToast('error', "Users", error.error.message);
      }
    })
  }

  onRowSelect(event: any){
    this.titleModal = "Editar usuario";
    this.showModal = true;
  }

  handleSuccess(){
    this.userSelected = null;
    this.loadUsers();
    this.showModal = false;
  }
}