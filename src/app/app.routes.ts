import { Routes } from '@angular/router';
import { InterfazPage } from './features/interfaz-page/interfaz-page'; 


export const routes: Routes = [
   /* {
    path: '', 
    component: InterfazPage
  },
  {
    path: 'interfaz', 
    component: InterfazPage
  },

    {
        path: '',
        loadComponent: () => import('./features/interfaz-page/interfaz-page')
            .then(m => m.InterfazPage)
    },
*/
    {
        path: '',
        loadComponent: () => import('./features/Heuristica/interfaz-page-heuristica/interfaz-page-heuristica')
            .then(m => m.InterfazPageHeuristica)
    },

    // HEURÍSTICA 1 — Visibilidad del estado del sistema
    {
        path: 'visibilidad-estado-sistema',
        loadComponent: () => import('./features/Heuristica/visibilidad-estado-sistema/visibilidad-page')
            .then(m => m.VisibilidadPageComponent)
    },

    // HEURÍSTICA 2 — Correspondencia con el mundo real
    {
        path: 'correspondencia-mundo-real',
        loadComponent: () => import('./features/Heuristica/correspondencia-mundo-real/correspondencia-page')
            .then(m => m.CorrespondenciaPageComponent)
    },

    // HEURÍSTICA 3 — Control y libertad del usuario
    {
        path: 'control-libertad-usuario',
        loadComponent: () => import('./features/Heuristica/control-libertad-usuario/control-page')
            .then(m => m.ControlPageComponent)
    },

    // HEURÍSTICA 4 — Consistencia y estándares
    {
        path: 'consistencia-estandares',
        loadComponent: () => import('./features/Heuristica/consistencia-estandares/reconocimiento-consistencia-estandares')
            .then(m => m.ReconocimientoConsistenciaEstandares)
    },

    // HEURÍSTICA 5 — Prevención de errores
    {
        path: 'prevencion-errores',
        loadComponent: () => import('./features/Heuristica/prevencion-errores/prevencion-page')
            .then(m => m.PrevencionPageComponent)
    },

    // HEURÍSTICA 6 — Reconocimiento vs recordar
    {
        path: 'reconocimiento-recordar',
        loadComponent: () => import('./features/Heuristica/reconocimiento-recordar/reconocimiento-page')
            .then(m => m.ReconocimientoPageComponent)
    },

    // HEURÍSTICA 7 — Flexibilidad y Eficiencia
    {
        path: 'flexibilidad-eficiencia',
        loadComponent: () => import('./features/Heuristica/flecibilidad-eficiencia/flexibilidad-page')
            .then(m => m.FlexibilidadPage)
    },

    // HEURÍSTICA 8 — Diseño Estético y Minimalista
    {
        path: 'diseno-estetico-minimalista',
        loadComponent: () => import('./features/Heuristica/diseno-estatico-minimalista/minimalismo-page')
            .then(m => m.MinimalismoPage)
    },

    // HEURÍSTICA 9 — Errores y Recuperación
    {
        path: 'errores-recuperacion',
        loadComponent: () => import('./features/Heuristica/errores-recuperacion/errores-page')
            .then(m => m.ErroresPage)
    },

    // HEURÍSTICA 10 — Ayuda
    {
        path: 'ayuda',
        loadComponent: () => import('./features/Heuristica/ayuda-documentacion/ayuda-page')
            .then(m => m.AyudaPageComponent)
    },

    // Rutas de redirección desde el menú
    { path: '1', redirectTo: 'visibilidad-estado-sistema' },
    { path: 'heuristica/1', redirectTo: 'visibilidad-estado-sistema' },

    { path: '2', redirectTo: 'correspondencia-mundo-real' },
    { path: 'heuristica/2', redirectTo: 'correspondencia-mundo-real' },

    { path: '3', redirectTo: 'control-libertad-usuario' },
    { path: 'heuristica/3', redirectTo: 'control-libertad-usuario' },

    { path: '4', redirectTo: 'consistencia-estandares' },
    { path: 'heuristica/4', redirectTo: 'consistencia-estandares' },

    { path: '5', redirectTo: 'prevencion-errores' },
    { path: 'heuristica/5', redirectTo: 'prevencion-errores' },

    { path: '6', redirectTo: 'reconocimiento-recordar' },
    { path: 'heuristica/6', redirectTo: 'reconocimiento-recordar' },

    { path: '7', redirectTo: 'flexibilidad-eficiencia' },
    { path: 'heuristica/7', redirectTo: 'flexibilidad-eficiencia' },

    { path: '8', redirectTo: 'diseno-estetico-minimalista' },
    { path: 'heuristica/8', redirectTo: 'diseno-estetico-minimalista' },

    { path: '9', redirectTo: 'errores-recuperacion' },
    { path: 'heuristica/9', redirectTo: 'errores-recuperacion' },

    { path: '10', redirectTo: 'ayuda' },
    { path: 'heuristica/10', redirectTo: 'ayuda' },
    

    { path: '**', redirectTo: '' }
];