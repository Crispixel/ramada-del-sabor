import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css' // Puedes dejar este archivo vacío si usas styles.css global
})
export class ReviewsComponent {
  resena = {
    name: '',
    email: '',
    rating: 0,
    comments: ''
  };

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  setRating(stars: number) {
    this.resena.rating = stars;
  }

  enviarFormulario() {
    if (this.resena.rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    this.restaurantService.enviarResena(this.resena).subscribe({
      next: (resp) => {
        alert('Reseña enviada con éxito');
        this.router.navigate(['/']); // Volver al inicio
      },
      error: (err) => console.error(err)
    });
  }
}