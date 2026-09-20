import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DTO_Credentials } from '../models/DTOs/DTOs_Credentials';
import { environment } from '../../environments/environment.development';
import { DTO_MinimalUser } from '../models/DTOs/DTO_MinimalUser';
import { jwtDecode } from 'jwt-decode';
import { UserService } from './user.service';
import { Router } from '@angular/router';

interface JwtPayload{
  sub: string;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl + "/Auth";
  userLoging_$ = signal<DTO_MinimalUser | null>(null);
  userService = inject(UserService);
  private router = inject(Router);
  constructor(private http: HttpClient){}

  logingAsk(credentials: DTO_Credentials) : Promise<{success: boolean, message: string}>{
    return new Promise((resolve) => {
      this.http.post<{success: boolean, message: string, user?: DTO_MinimalUser, token? : string}>(`${this.apiUrl}/post-logingAsk`, credentials).subscribe({
        next: (res) => {
          if(!res.success){
            this.cleanUserAuth();
            resolve({
              success: false,
              message: res.message
            });
          }
          
          if(res.user && res.token){
            this.authUser(res.user, res.token);
            resolve({
              success: true,
              message: res.message
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          this.cleanUserAuth();
            resolve({
              success: false,
              message: error.error.message
            });
        }
      });

    })
  }

  authUser(user: DTO_MinimalUser, token: string){
    this.userLoging_$.set(user);
    localStorage.setItem("token", token);
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7);
    localStorage.setItem("expiresDate", expiresDate.toString());
  }

  logout(){
    this.cleanUserAuth();
    this.router.navigate(["/logingAsk"]);
  }

  cleanUserAuth(){
    this.userLoging_$.set(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiresDate");
  }


  getUserIdFromToken() : string | null{
    const token = localStorage.getItem("token");

    if(!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.sub || decoded.id || null;
    } catch (error) {
      return null;
    }
  }

  loadUserAuthenticaded(){
    const idUserString =  this.getUserIdFromToken();
    if(!idUserString) {
      this.router.navigate(["/logingAsk"]);
      return;
    }

    const idUser = parseInt(idUserString);
    this.userService.getMinimalUser(idUser).subscribe({
      next: (res) => {
        if(!res.success) return;

        if(res.user){
          this.userLoging_$.set(res.user);
          return;
        }
        console.log("No se pudo obtener el usuario")
      }
    })
    
  }
  
}
