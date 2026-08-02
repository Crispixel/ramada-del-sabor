import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 1. IMPORTANTE: Importar esto
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 2. IMPORTANTE: Agregar esta función aquí
    provideHttpClient()
  ]
};