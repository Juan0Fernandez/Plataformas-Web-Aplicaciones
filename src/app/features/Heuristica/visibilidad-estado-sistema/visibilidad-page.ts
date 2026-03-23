import { Component } from '@angular/core';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';
// Asegúrate que estos nombres de archivo coincidan con los que tienes en la carpeta
import { EstadoSistemaMaloComponent } from './estado-sistema-malo-component'; 
import { EstadoSistemaBuenoComponent } from './estado-sistema-bueno-component'; 

@Component({
  selector: 'app-visibilidad-page',
  standalone: true,
  imports: [HeaderHeuristicaComponent, EstadoSistemaMaloComponent, EstadoSistemaBuenoComponent],
  // VisibilidadPageComponent (Template)
   template: `
   <div class="p-4 min-h-screen bg-gray-50"> 
   <app-header-heuristica 
      numeroHeuristica="1" 
   titulo="Visibilidad del Estado del Sistema"  
   concepto="El sistema debe mantener informados a los usuarios sobre lo que está ocurriendo, proporcionando retroalimentación apropiada dentro de un tiempo razonable. Los usuarios nunca deben preguntarse qué está pasando en el sistema."
/>

<div class="grid md:grid-cols-2 gap-6 mt-6">
<app-estado-sistema-malo></app-estado-sistema-malo>
<app-estado-sistema-bueno></app-estado-sistema-bueno>
</div>
 </div>
`
})
export class VisibilidadPageComponent {}