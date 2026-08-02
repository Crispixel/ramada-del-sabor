import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ReviewsComponent } from './components/reviews/reviews';
import { ReservationComponent } from './components/reservation/reservation';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'resenas', component: ReviewsComponent },
    { path: 'reservar', component: ReservationComponent },
    { path: '**', redirectTo: '' }
];