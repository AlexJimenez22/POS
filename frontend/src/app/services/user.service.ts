import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTO_MinimalUser } from '../models/DTOs/DTO_MinimalUser';
import { environment } from '../../environments/environment.development';
import { User } from '../models/database/User';
import { DTO_UserCreate } from '../models/DTOs/DTO_UserCreate';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient){}

  apiUrl = environment.apiUrl + "/User";

  getAllUsers(): Observable<{success: boolean, message: string, data?: User[]}>{
    return this.http.get<{success: boolean, message: string, data?: User[]}>(`${this.apiUrl}/get-allUsers`);
  }

  getMinimalUser(idUser: number) : Observable<{success: boolean, message: string, user?: DTO_MinimalUser}>{
    return this.http.get<{success: boolean, message: string, user?: DTO_MinimalUser}>(`${this.apiUrl}/get-minimalUserById/${idUser}`);
  }

  postNewUser(user: DTO_UserCreate): Observable<{success: boolean, message: string}>{
    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/post-newUser`, user);
  }

  updateUser(idUser: number, user: DTO_UserCreate): Observable<{success: boolean, message: string}>{
    return this.http.put<{success: boolean, message: string}>(`${this.apiUrl}/put-user/${idUser}`, user);
  }
}
