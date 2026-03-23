import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
import { PrevencionBuenoComponent } from './prevencion-errore-bueno-component'; // Revisa el nombre exacto
import { PrevencionMaloComponent } from './prevencion-errores-malo-component'; // Revisa el nombre exacto

@Component({
  selector: 'app-prevencion-page',
  standalone: true,
  imports: [HeaderHeuristicaComponent, PrevencionMaloComponent, PrevencionBuenoComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
          numeroHeuristica="5" 
          titulo="Prevención de errores" 
          concepto="Es mejor un diseño cuidadoso que prevenga que ocurra un problema a un buen mensaje de error.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
          <app-prevencion-malo></app-prevencion-malo>
          <app-prevencion-bueno></app-prevencion-bueno>
       </div>
    </div>
  `
})
export class PrevencionPageComponent {}