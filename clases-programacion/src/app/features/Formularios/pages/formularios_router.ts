// src/app/features/formularios/formularios_router.ts

import { Routes } from '@angular/router';
import { Formulariopage } from "./formulario/formulario"; 
import { FormularioDinamicoComponent } from "./formulario-dinamico/formulario-dinamico"; 
import { FormulariosMasPage } from "./formulario-mas/formulario-mas"; // Importación de la Práctica 3

export const formulariosRoutes: Routes = [
  {
    path: '', 
    children: [
      {
        path: 'formulario', 
        title: 'Formulario Básico',
        component: Formulariopage, 
      },
      {
        path: 'formulario-dinamico', 
        title: 'Formulario Dinámico',
        component: FormularioDinamicoComponent, 
      },
      {
        path: 'formulario-mas', 
        title: 'Switches y Opciones',
        component: FormulariosMasPage, 
      },
    ],
  },
];