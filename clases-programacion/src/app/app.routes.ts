import { Routes } from '@angular/router';
import { Homepage } from './features/homepage/homepage';
import { Perfilpage } from './features/perfilpage/perfilpage';
import { ProyectosPage } from './features/proyectospage/proyectospage';
import { ProyectoDosPage } from './features/proyectos-dos-pages/proyectos-dos-pages';
import { Formulariopage } from './features/Formularios/pages/formulario/formulario';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'perfil', component: Perfilpage },
  { path: 'proyectos', component: ProyectosPage },
  { path: 'proyectos-dos', component: ProyectoDosPage },
 
  //{ path: 'formulario', component: Formulariopage },
 {
    path: 'formularios', 
    loadChildren: () => 
      import('./features/Formularios/pages/formularios_router')
      .then(m => m.formulariosRoutes)
  },
];