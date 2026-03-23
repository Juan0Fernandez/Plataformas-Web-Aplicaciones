// src/app/app.config.ts (VERSIÓN LIMPIA Y FUNCIONAL)

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router'; 
// ELIMINA LocationStrategy y HashLocationStrategy


import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    
    // Solo provideRouter, sin proveedores adicionales
    provideRouter(routes), 
    
    provideClientHydration(withEventReplay())
  ]
};