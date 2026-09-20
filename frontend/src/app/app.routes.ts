import { Routes } from '@angular/router';
import { Loging } from './general-components/loging/loging';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path:"logingAsk",
        component: Loging
    },
    {
        path:"",
        canActivate: [authGuard],
        loadComponent: () => import("./layout/main-layout/main-layout").then(m => m.MainLayout),
        children: [
            {
                path: "",
                loadChildren: () =>  import("./Pages/pages.routes").then(m => m.pagesRoutes)
            }
        ]
    }
];
