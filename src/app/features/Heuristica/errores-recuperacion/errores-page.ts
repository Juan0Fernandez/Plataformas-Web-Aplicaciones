// src/app/features/Heuristica/errores-recuperacion/errores-page.ts

import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
import { ErroresBuenoComponent } from './errores-bueno-component';

// 💡 CORRECCIÓN 2: Importar el componente 'errores-malo' del MISMO directorio
import { ErroresMaloComponent } from './errores-malo-component';

@Component({
  selector: 'app-errores-recuperacion-page',
  standalone: true,
  // 💡 CORRECCIÓN 3: Usar los nombres de los componentes de error en el array imports
  imports: [HeaderHeuristicaComponent, ErroresBuenoComponent, ErroresMaloComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
           numeroHeuristica="9" 
           titulo="Errores y Recuperación" 
           concepto="El sistema debe prevenir errores y permitir a los usuarios recuperarse rápidamente.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
           <app-errores-bueno></app-errores-bueno>
           <app-errores-malo></app-errores-malo>
       </div>
    </div>
  `
})
export class ErroresPage {}