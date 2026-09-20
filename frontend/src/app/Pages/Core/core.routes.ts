import { Routes } from "@angular/router";
import { GenerateSale } from "./generate-sale/generate-sale";
import { Warehouse } from "./warehouse/warehouse";


export const coreRoutes: Routes = [
    {
        path: "",
        redirectTo: "Generate-Sale",
        pathMatch: "full"
    },
    {
        path: "Generate-Sale",
        component: GenerateSale
    },
    {
        path: "Warehouse",
        component: Warehouse
    }
]