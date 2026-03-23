// prevencion-errores-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prevencion-malo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Transferencia Bancaria</h2>
      
      <!-- Sin validaciones preventivas -->
      <form (ngSubmit)="transfer()">
        <input 
          type="text" 
          [(ngModel)]="accountNumber" 
          name="account"
          placeholder="Número de cuenta"
          class="w-full p-3 border mb-4">
          
        <input 
          type="text" 
          [(ngModel)]="amount" 
          name="amount"
          placeholder="Cantidad"
          class="w-full p-3 border mb-4">
          
        <!-- Sin confirmación para acción crítica -->
        <button 
          type="submit"
          class="w-full bg-red-600 text-white p-3 rounded">
          Transferir Dinero
        </button>
      </form>
    </div>
  `
})
export class PrevencionMaloComponent {
  accountNumber = '';
  amount = '';
  
  transfer() {
    // Sin validaciones - permite errores críticos
    console.log('Transferencia realizada');
  }
}