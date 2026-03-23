import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
import { MundoRealMaloComponent } from './mundo-real-malo-component';
import { MundoRealBuenoComponent } from './mundo-real-bueno-component';

@Component({
  selector: 'app-correspondencia-page',
  standalone: true,
  imports: [HeaderHeuristicaComponent, MundoRealMaloComponent, MundoRealBuenoComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
          numeroHeuristica="2" 
          titulo="Correspondencia con el mundo real" 
          concepto="El sistema debe hablar el lenguaje de los usuarios con palabras, frases y conceptos familiares.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
          <app-mundo-real-malo></app-mundo-real-malo>
          <app-mundo-real-bueno></app-mundo-real-bueno>
       </div>
    </div>
  `
})
export class CorrespondenciaPageComponent {}