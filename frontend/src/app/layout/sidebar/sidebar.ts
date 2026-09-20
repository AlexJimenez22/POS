import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AskForActions } from "../../directives/ask-for-actions";

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, AskForActions],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

  menuItems = [
    {
      name: "Generar venta",
      path: "/Core/Generate-Sale",
      icon: "pi-receipt",
      rolesAllowed: ["employee", "admin"]
    },
    {
      name: "Inventario",
      path: "/Core/Warehouse",
      icon: "pi-warehouse",
      rolesAllowed: ["employee", "admin"]
    },
    {
      name: "Ventas",
      path: "/Administrator/Sales",
      icon: "pi-chart-bar",
      rolesAllowed: ["admin"]
    },
    {
      name: "Catalogo de unidades",
      path: "/Administrator/Units",
      icon: "pi-slack",
      rolesAllowed: ["admin"]
    },
    {
      name: "Usuarios",
      path: "/Administrator/Users",
      icon: "pi-user",
      rolesAllowed: ["admin"]
    },
  ];
}
