import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-heuristica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white p-8 rounded-2xl shadow-2xl mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span class="text-2xl">{{ getIcon() }}</span>
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-2 tracking-tight">{{ titulo() }}</h1>
          <div class="flex items-center space-x-2 text-blue-100">
            <span class="w-2 h-2 bg-blue-300 rounded-full"></span>
            <span class="text-sm font-medium uppercase tracking-wider">Heurística {{ numeroHeuristica() }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 class="text-lg font-semibold mb-3 text-blue-100">📖 Concepto:</h3>
        <p class="text-white leading-relaxed">{{ concepto() }}</p>
      </div>
    </div>
  `
})
export class HeaderHeuristicaComponent {
  numeroHeuristica = input.required<string>();
  titulo = input.required<string>();
  concepto = input.required<string>();
  
  getIcon(): string {
    const iconMap: { [key: string]: string } = {
      '1': '👁️', '2': '🌍', '3': '🎮', '4': '📏', '5': '🚫',
      '6': '💭', '7': '⚡', '8': '🎨', '9': '🆘', '10': '📚'
    };
    return iconMap[this.numeroHeuristica()] || '🔍';
  }
}