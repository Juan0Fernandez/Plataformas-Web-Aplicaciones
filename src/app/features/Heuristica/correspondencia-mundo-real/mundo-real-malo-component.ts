// mundo-real-malo.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mundo-real-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Sistema de Archivos</h2>
      
      <!-- Terminología técnica confusa -->
      <div class="space-y-3">
        <button class="block w-full p-3 bg-gray-200 text-left rounded" 
                (click)="executeOperation('init_fs')">
          Inicializar Sistema de Archivos (init_fs)
        </button>
        
        <button class="block w-full p-3 bg-gray-200 text-left rounded"
                (click)="executeOperation('create_node')">
          Crear Nodo de Directorio (create_node)
        </button>
        
        <button class="block w-full p-3 bg-gray-200 text-left rounded"
                (click)="executeOperation('alloc_mem')">
          Asignar Memoria de Buffer (alloc_mem)
        </button>
        
        <button class="block w-full p-3 bg-gray-200 text-left rounded"
                (click)="executeOperation('persist_data')">
          Persistir Datos en Storage (persist_data)
        </button>
      </div>
      
      <div class="mt-4 p-3 bg-gray-100 rounded">
        <p class="text-sm">Output: {{ lastOperation() }}</p>
      </div>
    </div>
  `
})
export class MundoRealMaloComponent {
  lastOperation = signal('');
  
  executeOperation(op: string) {
    this.lastOperation.set(`Ejecutado: ${op}`);
  }
}