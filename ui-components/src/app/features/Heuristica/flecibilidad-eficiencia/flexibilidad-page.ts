import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
import { FlexibilidadBuenoComponent } from './flexibilidad-eficiencia-bueno-component';
import { FlexibilidadMaloComponent } from './flexibilidad-eficiencia-malo-component';

@Component({
  selector: 'app-flexibilidad-eficiencia-page',
  standalone: true,
  imports: [HeaderHeuristicaComponent, FlexibilidadBuenoComponent, FlexibilidadMaloComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
           numeroHeuristica="7" 
           titulo="Flexibilidad y Eficiencia" 
           concepto="Los sistemas deben ser flexibles y eficientes, adaptándose a las necesidades del usuario.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
           <app-flexibilidad-eficiencia-bueno></app-flexibilidad-eficiencia-bueno>
           <app-flexibilidad-eficiencia-malo></app-flexibilidad-eficiencia-malo>
       </div>
    </div>
  `
})
export class FlexibilidadPage {}
