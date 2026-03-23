import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
import { ControlLibertadMaloComponent } from './control-libertad-malo-component';
import { ControlLibertadBuenoComponent } from './control-libertad-bueno-component';

@Component({
  selector: 'app-control-page',
  standalone: true,
  imports: [HeaderHeuristicaComponent, ControlLibertadMaloComponent, ControlLibertadBuenoComponent],
  template: `
    <div class="p-4 min-h-screen bg-gray-50">
       <app-header-heuristica 
          numeroHeuristica="3" 
          titulo="Control y libertad del usuario" 
          concepto="Los usuarios eligen funciones por error y necesitan una 'salida de emergencia' claramente marcada.">
       </app-header-heuristica>

       <div class="grid md:grid-cols-2 gap-6 mt-6">
          <app-control-libertad-malo></app-control-libertad-malo>
          <app-control-libertad-bueno></app-control-libertad-bueno>
       </div>
    </div>
  `
})
export class ControlPageComponent {}