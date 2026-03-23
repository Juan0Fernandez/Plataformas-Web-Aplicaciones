// estado-sistema-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estado-sistema-malo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Subir Archivo</h2>
      
      <!-- Sin indicadores de estado -->
      <input type="file" (change)="onFileSelect($event)" class="mb-4">
      
      <!-- Botón sin feedback visual -->
      <button (click)="uploadFile()" class="bg-blue-500 text-white px-4 py-2 rounded">
        Subir
      </button>
      
      <!-- Sin mostrar progreso -->
      <div class="mt-4">
        <p>Resultado aparecerá aquí...</p>
      </div>
    </div>
  `
})
export class EstadoSistemaMaloComponent {
  selectedFile: File | null = null;
  
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  uploadFile() {
    if (!this.selectedFile) return;
    
    // Simula subida - SIN FEEDBACK AL USUARIO
    setTimeout(() => {
      console.log('Archivo subido');
    }, 3000);
  }
}