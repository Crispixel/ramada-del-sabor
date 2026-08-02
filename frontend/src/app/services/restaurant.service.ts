import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = environment.apiUrl; // Cambia según environment.ts / environment.prod.ts

  constructor(private http: HttpClient) { }

  getPlatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/platos`);
  }

  enviarResena(resena: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/resenas`, resena);
  }

  getHorariosDisponibles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/reservas/horarios`);
  }

  enviarReserva(reserva: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservas`, reserva);
  }
}