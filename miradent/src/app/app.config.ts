import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { rutas } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(rutas)],
};