// consistencia-estandares-page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsistenciaMaloComponent } from './consistencia-estandares-malo-component';
import { ConsistenciaBuenoComponent } from './consistencia-estandares-bueno-component';
import { ReconocimientoBuenoComponent } from '../reconocimiento-recordar/reconocimiento-bueno-component';

@Component({
  selector: 'app-consistencia-page',
  standalone: true,
  imports: [CommonModule, ConsistenciaMaloComponent, ConsistenciaBuenoComponent],
  template: `
    <div class="p-6 max-w-4xl mx-auto">

      <h1 class="text-2xl font-bold mb-6 flex items-center">
        <span class="mr-3">📏</span>
        Consistencia y Estándares
      </h1>

      <p class="mb-6 text-gray-700">
        Los usuarios no deberían preguntarse si diferentes acciones significan lo mismo.
        La interfaz debe mantener patrones estables y coherentes.
      </p>

      <!-- Ejemplo Malo -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-3 text-red-600">❌ Ejemplo Incorrecto</h2>
        <app-consistencia-malo></app-consistencia-malo>
      </div>

      <!-- Ejemplo Bueno -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-3 text-green-700">✅ Ejemplo Correcto</h2>
        <app-consistencia-bueno></app-consistencia-bueno>
      </div>

    </div>
  `
})
export class ReconocimientoConsistenciaEstandares {}