// prevencion-errores-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prevencion-bueno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">🏦</span>
        <h2 class="text-xl font-semibold">Transferencia Bancaria</h2>
      </div>
      
      <form (ngSubmit)="transfer()">
        <!-- Campo cuenta con validación en tiempo real -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Número de Cuenta Destino
          </label>
          <input 
            type="text" 
            [(ngModel)]="accountNumber" 
            name="account"
            (input)="validateAccount()"
            placeholder="0000-0000-0000-0000"
            maxlength="19"
            class="w-full p-3 border-2 rounded-lg transition-colors"
            [ngClass]="{
              'border-green-500 bg-green-50': accountValid() === true,
              'border-red-500 bg-red-50': accountValid() === false,
              'border-gray-300': accountValid() === null
            }">
          
          @if (accountValid() === false) {
            <div class="mt-2 flex items-center text-red-600 text-sm">
              <span class="mr-2">⚠️</span>
              El número de cuenta debe tener 16 dígitos
            </div>
          }
        </div>

        <!-- Campo monto con validaciones -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Monto a Transferir
          </label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-gray-500">$</span>
            <input 
              type="number" 
              [(ngModel)]="amount" 
              name="amount"
              (input)="validateAmount()"
              placeholder="0.00"
              min="0.01"
              max="10000"
              step="0.01"
              class="w-full p-3 pl-8 border-2 rounded-lg">
          </div>
          
          @if (amount > 5000) {
            <div class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-center text-yellow-800 text-sm">
                <span class="mr-2">🚨</span>
                <strong>Monto Alto:</strong> Requiere confirmación adicional
              </div>
            </div>
          }
        </div>

        <!-- Botón con protección -->
        <button 
          type="submit"
          [disabled]="!readyToTransfer() || processing()"
          class="w-full p-4 rounded-lg font-semibold transition-all duration-200"
          [ngClass]="{
            'bg-blue-600 hover:bg-blue-700 text-white': readyToTransfer() && !processing(),
            'bg-gray-300 text-gray-500 cursor-not-allowed': !readyToTransfer() || processing()
          }">
          
          @if (processing()) {
            Procesando...
          } @else {
            🔒 Confirmar Transferencia
          }
        </button>
      </form>
    </div>
  `
})
export class PrevencionBuenoComponent {
  accountNumber = '';
  amount: number = 0;
  
  accountValid = signal<boolean | null>(null);
  processing = signal(false);
  
  validateAccount() {
    const cleaned = this.accountNumber.replace(/[^0-9]/g, '');
    if (cleaned.length <= 16) {
      const formatted = cleaned.replace(/(.{4})/g, '$1-').replace(/-$/, '');
      this.accountNumber = formatted;
    }
    this.accountValid.set(cleaned.length === 16);
  }
  
  validateAmount() {
    // Validación automática por HTML5 constraints
  }
  
  readyToTransfer(): boolean {
    return this.accountValid() === true && this.amount > 0 && this.amount <= 10000;
  }
  
  transfer() {
    if (!this.readyToTransfer()) return;
    
    const confirmMessage = this.amount > 5000 
      ? `¿Confirmar transferencia de $${this.amount}? MONTO ALTO - Esta acción no se puede deshacer.`
      : `¿Confirmar transferencia de $${this.amount}?`;
      
    if (confirm(confirmMessage)) {
      this.processing.set(true);
      setTimeout(() => {
        this.processing.set(false);
        alert('Transferencia completada');
      }, 2000);
    }
  }
}