import { Routes } from "@angular/router";
import { Loging } from "../general-components/loging/loging";
import { roleGuard } from "../guards/role-guard";


export const pagesRoutes: Routes = [
    {
        path: "",
        redirectTo:"Core",
        pathMatch: "full"
    },
    {
        path: "Core",
        canMatch: [roleGuard],
        data: {
            roles: ["admin", "employee"]
        },
        loadChildren: () =>
            import("./Core/core.routes")
                .then(m => m.coreRoutes)
    },
    {
        path: "Administrator",
        canMatch: [roleGuard],
        data: {
            roles: ["admin"]
        },
        loadChildren: () =>
            import("./Administrator/administrator.routes")
                .then(m => m.administratorRoutes)
    }
]