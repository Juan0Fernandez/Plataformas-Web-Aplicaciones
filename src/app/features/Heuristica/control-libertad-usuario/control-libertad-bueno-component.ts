// control-libertad-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderHeuristicaComponent } from '../component/header-heuristica/header-heuristica.component';

@Component({
  selector: 'app-control-libertad-bueno',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderHeuristicaComponent],
  template: `
    <div class="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <span class="text-2xl mr-3">📝</span>
          <h2 class="text-xl font-semibold">Editor de Texto</h2>
        </div>
        
        <!-- Controles de deshacer/rehacer -->
        <div class="flex space-x-2">
          <button 
            (click)="undo()"
            [disabled]="!canUndo()"
            class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg border transition-colors"
            title="Deshacer (Ctrl+Z)">
            ↶ Deshacer
          </button>
          
          <button 
            (click)="redo()"
            [disabled]="!canRedo()"
            class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg border transition-colors"
            title="Rehacer (Ctrl+Y)">
            ↷ Rehacer
          </button>
        </div>
      </div>
      
      <!-- Editor con historial -->
      <textarea 
        [(ngModel)]="content" 
        (input)="onTextChange()"
        class="w-full h-40 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
        placeholder="Escribe aquí... Usa Ctrl+Z para deshacer y Ctrl+Y para rehacer">
      </textarea>
      
      <!-- Información del historial -->
      <div class="mt-2 text-sm text-gray-600 flex justify-between">
        <span>Cambios: {{ history().length }}</span>
        <span>Posición: {{ currentIndex() + 1 }}</span>
      </div>
      
      <!-- Modal controlable por el usuario -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-xl max-w-md w-full mx-4 border">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Guardando Texto</h3>
              <!-- Botón X para cerrar -->
              <button 
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                ×
              </button>
            </div>
            
            <div class="mb-4">
              <p class="mb-2">Guardando tu documento...</p>
              <!-- Barra de progreso -->
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  [style.width.%]="saveProgress()">
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ saveProgress() }}% completado</p>
            </div>
            
            <!-- Múltiples opciones de control -->
            <div class="flex space-x-3">
              <button 
                (click)="cancelSave()"
                class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                ❌ Cancelar
              </button>
              
              <button 
                (click)="saveInBackground()"
                class="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                🔄 Continuar en segundo plano
              </button>
            </div>
          </div>
        </div>
      }
      
      <!-- Controles principales -->
      <div class="mt-6 flex space-x-3">
        <button 
          (click)="saveText()"
          [disabled]="content.length === 0"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors">
          💾 Guardar Texto
        </button>
        
        <button 
          (click)="clearText()"
          [disabled]="content.length === 0"
          class="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg font-medium transition-colors">
          🗑️ Limpiar Todo
        </button>
        
        <button 
          (click)="loadTemplate()"
          class="px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors">
          📄 Cargar Plantilla
        </button>
      </div>
    </div>
  `
})
export class ControlLibertadBuenoComponent {
  content = '';
  showModal = signal(false);
  saveProgress = signal(0);
  history = signal<string[]>(['']);
  currentIndex = signal(0);
  
  onTextChange() {
    const newHistory = this.history().slice(0, this.currentIndex() + 1);
    newHistory.push(this.content);
    this.history.set(newHistory);
    this.currentIndex.set(newHistory.length - 1);
  }
  
  canUndo(): boolean {
    return this.currentIndex() > 0;
  }
  
  canRedo(): boolean {
    return this.currentIndex() < this.history().length - 1;
  }
  
  undo() {
    if (this.canUndo()) {
      this.currentIndex.update(i => i - 1);
      this.content = this.history()[this.currentIndex()];
    }
  }
  
  redo() {
    if (this.canRedo()) {
      this.currentIndex.update(i => i + 1);
      this.content = this.history()[this.currentIndex()];
    }
  }
  
  saveText() {
    this.showModal.set(true);
    this.saveProgress.set(0);
    
    const interval = setInterval(() => {
      const progress = this.saveProgress();
      if (progress < 100) {
        this.saveProgress.set(Math.min(progress + 20, 100));
      } else {
        clearInterval(interval);
        setTimeout(() => this.closeModal(), 1000);
      }
    }, 500);
  }
  
  closeModal() {
    this.showModal.set(false);
    this.saveProgress.set(0);
  }
  
  cancelSave() {
    this.closeModal();
  }
  
  saveInBackground() {
    this.showModal.set(false);
    // Continúa guardando en segundo plano
  }
  
  clearText() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el texto?')) {
      this.content = '';
      this.onTextChange();
    }
  }
  
  loadTemplate() {
    this.content = 'Plantilla de ejemplo:\n\n1. Introducción\n2. Desarrollo\n3. Conclusiones';
    this.onTextChange();
  }
}