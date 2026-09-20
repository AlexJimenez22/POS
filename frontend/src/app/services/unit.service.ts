import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from '../models/database/Unit';
import { DTO_UnitCreate } from '../models/DTOs/DTO_UnitCreate';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor( private http: HttpClient ){}
  apiUrl: string = environment.apiUrl + '/Unit';

  getAllUnits(): Observable<{success: boolean, message: string, data?: Unit[]}>{
    return this.http.get<{success: boolean, message: string, data?: Unit[]}>(`${this.apiUrl}/get-allUnits`);
  }

  getAllUnitsEnable(): Observable<{success: boolean, message: string, data?: Unit[]}>{
    return this.http.get<{success: boolean, message: string, data?: Unit[]}>(`${this.apiUrl}/get-allUnitsEnable`);
  }

  postNewUnit( unit: DTO_UnitCreate):  Observable<{success: boolean, message: string}>{
    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/post-newUnit`, unit);
  }
  
  putUnit( idUnit: number, unit: DTO_UnitCreate):  Observable<{success: boolean, message: string}>{
    return this.http.put<{success: boolean, message: string}>(`${this.apiUrl}/put-unit/${idUnit}`, unit);
  }
}
