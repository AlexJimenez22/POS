import { Routes } from "@angular/router";
import { Sales } from "./sales/sales";
import { Users } from "./users/users";
import { Units } from "./units/units";

export const administratorRoutes: Routes = [
    {
        path: "Sales",
        component: Sales
    },
    {
        path: "Users",
        component: Users
    },
    {
        path: "Units",
        component: Units
    }
]