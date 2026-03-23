import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
import { ReconocimientoMaloComponent } from './reconocimiento-malo-component';
import { ReconocimientoBuenoComponent } from './reconocimiento-bueno-component';

@Component({
  selector: 'app-reconocimiento-page',
  standalone: true,
  imports: [HeaderHeuristicaComponent, ReconocimientoMaloComponent, ReconocimientoBuenoComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
          numeroHeuristica="6" 
          titulo="Reconocer en lugar de recordar" 
          concepto="Minimizar la carga de memoria del usuario haciendo visibles objetos, acciones y opciones.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
          <app-reconocimiento-malo></app-reconocimiento-malo>
          <app-reconocimiento-bueno></app-reconocimiento-bueno>
       </div>
    </div>
  `
})
export class ReconocimientoPageComponent {}