import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
import { AyudaBuenoComponent } from './ayuda-bueno-component';
import { AyudaMaloComponent } from './ayuda-malo-component';

@Component({
  selector: 'app-ayuda-page',
  standalone: true,
  imports: [HeaderHeuristicaComponent, AyudaBuenoComponent, AyudaMaloComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
          numeroHeuristica="10" 
          titulo="Ayuda" 
          concepto="Los usuarios deben tener acceso a la ayuda cuando la necesiten.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
          <app-ayuda-bueno></app-ayuda-bueno>
          <app-ayuda-malo></app-ayuda-malo>
       </div>
    </div>
  `
})
export class AyudaPageComponent {}
