import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para mostrar listas (*ngFor)
import { RestaurantService } from './services/restaurant.service'; // Asegúrate que esta ruta sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule], // Agregamos CommonModule aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // "implements OnInit" es clave para que cargue al inicio
  
  title = 'frontend';
  platos: any[] = []; // Aquí se guardarán tus platos

  // Inyectamos el servicio (forma moderna de Angular)
  private restaurantService = inject(RestaurantService);

  // 1. Esto se ejecuta AUTOMÁTICAMENTE cuando recargas la página
  ngOnInit(): void {
    this.cargarDatos('Platos a la carta'); // Carga datos por defecto
  }

  // 2. Esta función sirve tanto para el inicio como para los botones
  cargarDatos(categoria: string) {
    // LLamamos a tu servicio
    this.restaurantService.getPlatos().subscribe({
      next: (data: any) => {
        this.platos = data;
        console.log('Platos cargados:', this.platos);
        
        // Opcional: Si necesitas filtrar por categoría en el frontend
        // this.platos = data.filter(p => p.categoria === categoria);
      },
      error: (error) => {
        console.error('Error al cargar platos:', error);
      }
    });
  }
}