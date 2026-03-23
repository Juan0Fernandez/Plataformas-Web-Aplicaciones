// consistencia-estandares-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consistencia-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Panel de Control</h2>
      
      <!-- Botones consistentes -->
      <div class="space-y-4">
        <!-- Botones con estilos consistentes -->
        <button class="bg-blue-500 text-white px-6 py-2 rounded-lg">
          GUARDAR PERFIL
        </button>
        
        <button class="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Guardar Configuración
        </button>
        
        <button class="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Guardar Datos
        </button>
        
        <button class="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Guardar cambios
        </button>
      </div>
      
      <!-- Iconos consistentes para acciones similares -->
      <div class="mt-8 grid grid-cols-2 gap-4">
        <div class="p-4 border">
          <span class="text-2xl">🗑️</span>
          <p>Eliminar Usuario</p>
        </div>
        
        <div class="p-4 border">
          <span class="text-2xl">🗑️</span>
          <p>Eliminar Archivo</p>
        </div>
        
        <div class="p-4 border">
          <span class="text-2xl">🗑️</span>
          <p>Quitar Elemento</p>
        </div>
        
        <div class="p-4 border">
          <span class="text-2xl">🗑️</span>
          <p>Destruir Datos</p>
        </div>
      </div>
    </div>
  `
})
export class ConsistenciaMaloComponent {}