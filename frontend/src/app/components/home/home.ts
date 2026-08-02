import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  platos: any[] = [];
  platosFiltrados: any[] = [];
  
  // ¡AQUÍ ESTABA EL ERROR! 
  // Debe decir 'tipicas' (sin tilde, minúscula) para coincidir con tu base de datos al iniciar.
  categoriaActual: string = 'tipicas'; 

  terminoBusqueda: string = '';
  minutosLlegada: number = 0;
  favoritos: string[] = [];
  
  private restaurantService = inject(RestaurantService);

  ngOnInit(): void {
    // 1. Calcular minutos aleatorios
    this.minutosLlegada = Math.floor(Math.random() * (60 - 3 + 1)) + 3;

    // 2. Cargar favoritos guardados
    const favs = localStorage.getItem('favoritos');
    this.favoritos = favs ? JSON.parse(favs) : [];

    // 3. Cargar platos automáticamente
    this.obtenerPlatos();
  }

  obtenerPlatos() {
    this.restaurantService.getPlatos().subscribe({
      next: (data: any) => {
        this.platos = data;
        console.log('Platos cargados:', this.platos); 
        
        // IMPORTANTE: Filtrar inmediatamente después de que lleguen los datos
        // para que aparezcan en pantalla sin tener que dar clic.
        this.filtrarPlatos(); 
      },
      error: (error) => {
        console.error('Error al conectar con el backend:', error);
      }
    });
  }

  cambiarTab(categoria: string) {
    this.categoriaActual = categoria;
    this.filtrarPlatos();
  }

  filtrarPlatos() {
    this.platosFiltrados = this.platos.filter(plato => {
      // 1. Filtro por categoría (debe coincidir 'tipicas' o 'carta')
      const coincideCategoria = plato.categoria === this.categoriaActual;
      
      // 2. Filtro por buscador (nombre o descripción)
      const busqueda = this.terminoBusqueda.toLowerCase();
      const coincideBusqueda = plato.nombre.toLowerCase().includes(busqueda) || 
                               plato.descripcion.toLowerCase().includes(busqueda);
      
      return coincideCategoria && coincideBusqueda;
    });
  }

  esFavorito(nombrePlato: string): boolean {
    return this.favoritos.includes(nombrePlato);
  }

  toggleFavorito(nombrePlato: string) {
    if (this.esFavorito(nombrePlato)) {
      this.favoritos = this.favoritos.filter(p => p !== nombrePlato);
    } else {
      this.favoritos.push(nombrePlato);
    }
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  }
}