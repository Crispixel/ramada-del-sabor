import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css'
})
export class ReservationComponent implements OnInit {

  reserva = {
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: 2,
    comentarios: ''
  };

  // Fecha mínima seleccionable = hoy (formato yyyy-MM-dd para el input date)
  fechaMinima: string = '';

  horarios: string[] = [];
  cargandoHorarios = true;

  enviando = false;
  errorEnvio: string = '';

  // Controla si se muestra el formulario o la tarjeta de confirmación
  reservaConfirmada: any = null;

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaMinima = hoy.toISOString().split('T')[0];

    this.restaurantService.getHorariosDisponibles().subscribe({
      next: (data) => {
        this.horarios = data;
        this.cargandoHorarios = false;
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        // Horarios de respaldo por si el backend no responde
        this.horarios = ['12:00', '13:00', '14:00', '18:00', '19:00', '20:00'];
        this.cargandoHorarios = false;
      }
    });
  }

  seleccionarHora(hora: string) {
    this.reserva.hora = hora;
  }

  cambiarPersonas(delta: number) {
    const nuevoValor = this.reserva.personas + delta;
    if (nuevoValor >= 1 && nuevoValor <= 20) {
      this.reserva.personas = nuevoValor;
    }
  }

  enviarFormulario() {
    this.errorEnvio = '';

    if (!this.reserva.hora) {
      this.errorEnvio = 'Por favor selecciona un horario para tu reserva.';
      return;
    }

    this.enviando = true;

    this.restaurantService.enviarReserva(this.reserva).subscribe({
      next: (resp) => {
        this.enviando = false;
        this.reservaConfirmada = resp.reserva;
      },
      error: (err) => {
        this.enviando = false;
        this.errorEnvio = err?.error?.mensaje || 'No se pudo completar la reserva. Intenta nuevamente.';
        console.error(err);
      }
    });
  }

  hacerOtraReserva() {
    this.reservaConfirmada = null;
    this.reserva = {
      nombre: '',
      email: '',
      telefono: '',
      fecha: '',
      hora: '',
      personas: 2,
      comentarios: ''
    };
  }

  irAlInicio() {
    this.router.navigate(['/']);
  }
}
