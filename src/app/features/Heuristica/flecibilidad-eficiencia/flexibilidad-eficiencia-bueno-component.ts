// flexibilidad-bueno.component.ts
import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flexibilidad-eficiencia-bueno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg border">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <span class="text-2xl mr-3">⚡</span>
          <h2 class="text-xl font-semibold">Redacción Rápida con Flexibilidad</h2>
        </div>

        <!-- Modo experto -->
        <button 
          (click)="toggleModoExperto()"
          class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          [ngClass]="{
            'bg-blue-600 text-white border-blue-700': modoExperto(),
            'bg-gray-100 border-gray-300 text-gray-700': !modoExperto()
          }">
          {{ modoExperto() ? 'Modo Avanzado Activado' : 'Modo Avanzado Desactivado' }}
        </button>
      </div>

      <!-- Controles de personalización -->
      @if (modoExperto()) {
        <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-semibold mb-3">Ajustes Personalizados</h3>
          
          <div class="flex space-x-4 items-center">

            <div>
              <label class="text-sm text-gray-700">Tamaño de texto</label>
              <select 
                [(ngModel)]="tamanoTexto"
                class="p-2 border rounded ml-2">
                <option value="text-sm">Pequeño</option>
                <option value="text-base">Mediano</option>
                <option value="text-lg">Grande</option>
              </select>
            </div>

            <div>
              <label class="text-sm text-gray-700">Plantillas rápidas</label>
              <select 
                (change)="insertarPlantilla($event)"
                class="p-2 border rounded ml-2">
                <option value="">Seleccionar plantilla</option>
                <option value="saludo">Saludo Formal</option>
                <option value="recordatorio">Recordatorio</option>
                <option value="despedida">Despedida</option>
              </select>
            </div>
          </div>
        </div>
      }

      <!-- Área de texto -->
      <textarea
        [(ngModel)]="mensaje"
        (input)="autoGuardar()"
        class="w-full h-40 p-4 border-2 rounded-lg transition-all duration-200"
        [class]="tamanoTexto">
      </textarea>

      <div class="text-sm text-gray-600 mt-2">
        Último autoguardado: {{ ultimoGuardado() }}
      </div>

      <!-- Botones -->
      <div class="flex space-x-3 mt-4">

        <button 
          (click)="enviar()"
          class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">
          Enviar Mensaje
        </button>

        @if (modoExperto()) {
          <button 
            (click)="limpiar()"
            class="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold">
            Limpiar
          </button>
        }
      </div>

      <!-- Instrucciones de atajos -->
      @if (modoExperto()) {
        <div class="mt-4 p-3 bg-gray-100 border rounded text-sm text-gray-700">
          Atajos disponibles:
          <ul class="list-disc ml-6 mt-1">
            <li>Ctrl + Enter: Enviar mensaje</li>
            <li>Ctrl + L: Limpiar texto</li>
          </ul>
        </div>
      }

    </div>
  `
})
export class FlexibilidadBuenoComponent {
  mensaje = '';
  tamanoTexto = 'text-base';
  modoExperto = signal(false);
  ultimoGuardado = signal('Nunca');

  toggleModoExperto() {
    this.modoExperto.update(v => !v);
  }

  insertarPlantilla(event: any) {
    const value = event.target.value;

    const plantillas: any = {
      saludo: 'Estimado/a,\n\nEspero que se encuentre bien.\n',
      recordatorio: 'Recordatorio:\nNo olvide revisar el siguiente pendiente...\n',
      despedida: 'Saludos cordiales,\n\n'
    };

    if (plantillas[value]) {
      this.mensaje += '\n' + plantillas[value];
    }
  }

  autoGuardar() {
    const fecha = new Date().toLocaleTimeString();
    this.ultimoGuardado.set(fecha);
  }

  enviar() {
    alert('Mensaje enviado');
  }

  limpiar() {
    this.mensaje = '';
  }

  @HostListener('document:keydown', ['$event'])
  manejarAtajos(event: KeyboardEvent) {
    if (!this.modoExperto()) return;

    if (event.ctrlKey && event.key === 'Enter') {
      this.enviar();
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      this.limpiar();
    }
  }
}