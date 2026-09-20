import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DTO_MinimalUser } from '../../models/DTOs/DTO_MinimalUser';
import { CommonModule } from '@angular/common';
import { TextLogo } from "../../general-components/text-logo/text-logo";
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, TextLogo, MenuModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar implements OnInit {
  @Output() sidebarStatus = new EventEmitter();
  authService = inject(AuthService);
  user = this.authService.userLoging_$;

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Usuario',
        items: [
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
  }

  logout(){
    this.authService.logout();
  }

  changeSidebarStatus() {
    this.sidebarStatus.emit();
  }

  
}
