// consistencia-estandares-bueno.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consistencia-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">⚙️</span>
        <h2 class="text-xl font-semibold">Panel de Control</h2>
      </div>
      
      <!-- Botones consistentes - mismo patrón para acciones similares -->
      <div class="space-y-3">
        <h3 class="text-lg font-medium mb-3">Acciones de Guardar</h3>
        
        <!-- Todos los botones de guardar siguen el mismo patrón -->
        <button class="flex items-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <span class="mr-3">💾</span>
          Guardar Perfil
        </button>
        
        <button class="flex items-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <span class="mr-3">💾</span>
          Guardar Configuración
        </button>
        
        <button class="flex items-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <span class="mr-3">💾</span>
          Guardar Datos
        </button>
      </div>
      
      <!-- Acciones de eliminación - patrón consistente para acciones destructivas -->
      <div class="mt-8 grid grid-cols-2 gap-4">
        <h3 class="col-span-2 text-lg font-medium mb-3">Acciones de Eliminación</h3>
        
        <button class="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg transition-colors">
          <span class="text-2xl mb-2">🗑️</span>
          <span class="text-red-700 font-medium">Eliminar Usuario</span>
        </button>
        
        <button class="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg transition-colors">
          <span class="text-2xl mb-2">🗑️</span>
          <span class="text-red-700 font-medium">Eliminar Archivo</span>
        </button>
      </div>
    </div>
  `
})
export class ConsistenciaBuenoComponent {}