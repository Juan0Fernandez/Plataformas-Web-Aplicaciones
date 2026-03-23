import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';

import { MinimalismoBuenoComponent } from '../diseno-estatico-minimalista/minimalismo-bueno-component';
import { MinimalismoMaloComponent } from '../diseno-estatico-minimalista/minimalismo-malo-component';

@Component({
  selector: 'app-diseno-estetico-minimalista-page',
  standalone: true,
  imports: [CommonModule, HeaderHeuristicaComponent, MinimalismoBuenoComponent, MinimalismoMaloComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
          numeroHeuristica="8" 
          titulo="Diseño Estético y Minimalista" 
          concepto="El diseño debe ser estéticamente agradable y no debe sobrecargar al usuario.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
          <ng-container *ngComponentOutlet="minBueno"></ng-container>
          <ng-container *ngComponentOutlet="minMalo"></ng-container>
       </div>
    </div>
  `
})
export class MinimalismoPage {
  readonly minBueno = MinimalismoBuenoComponent;
  readonly minMalo = MinimalismoMaloComponent;
}
