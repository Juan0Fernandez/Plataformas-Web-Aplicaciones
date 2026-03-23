import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reconocimiento-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">🍕</span>
        <h2 class="text-xl font-semibold">Configurar tu Pizza</h2>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Tamaño</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          @for (sizeOption of sizeOptions; track sizeOption.value) {
            <button 
              (click)="selectSize(sizeOption.value)"
              class="flex flex-col items-center p-4 border-2 rounded-lg transition-all"
              [ngClass]="{
                'border-blue-500 bg-blue-50': selectedSize() === sizeOption.value,
                'border-gray-200 hover:border-gray-300': selectedSize() !== sizeOption.value
              }">
              <span class="text-2xl mb-2">{{ sizeOption.icon }}</span>
              <span class="font-medium">{{ sizeOption.name }}</span>
              <span class="text-sm text-gray-600">{{ sizeOption.price }}</span>
            </button>
          }
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Tipo de Masa</h3>
        <div class="grid grid-cols-3 gap-3">
          @for (crustOption of crustOptions; track crustOption.value) {
            <button 
              (click)="selectCrust(crustOption.value)"
              class="flex flex-col items-center p-4 border-2 rounded-lg transition-all"
              [ngClass]="{
                'border-blue-500 bg-blue-50': selectedCrust() === crustOption.value,
                'border-gray-200 hover:border-gray-300': selectedCrust() !== crustOption.value
              }">
              <span class="text-2xl mb-2">{{ crustOption.icon }}</span>
              <span class="font-medium">{{ crustOption.name }}</span>
              <span class="text-xs text-gray-600 text-center">{{ crustOption.description }}</span>
            </button>
          }
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">
          Ingredientes ({{ selectedToppings().length }})
        </h3>
        <div class="grid grid-cols-3 md:grid-cols-4 gap-3">
          @for (topping of toppingOptions; track topping.value) {
            <button 
              (click)="toggleTopping(topping.value)"
              class="flex flex-col items-center p-3 border-2 rounded-lg transition-all relative"
              [ngClass]="{
                'border-green-500 bg-green-50': isSelected(topping.value),
                'border-gray-200 hover:border-gray-300': !isSelected(topping.value)
              }">
              
              @if (isSelected(topping.value)) {
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
              }
              
              <span class="text-xl mb-1">{{ topping.icon }}</span>
              <span class="text-xs font-medium text-center">{{ topping.name }}</span>
              <span class="text-xs text-gray-600">+\${{ topping.price }}</span>
            </button>
          }
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg mb-6 border">
        <div class="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>\${{ getTotal() }}</span>
        </div>
      </div>

      <button 
        [disabled]="!canOrder()"
        class="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors"
        [ngClass]="{
          'bg-green-600 hover:bg-green-700': canOrder(),
          'bg-gray-300 cursor-not-allowed': !canOrder()
        }">
        🛒 Ordenar Pizza
      </button>
    </div>
  `
})
export class ReconocimientoBuenoComponent {
  selectedSize = signal('');
  selectedCrust = signal('');
  selectedToppings = signal<string[]>([]);

  sizeOptions = [
    { value: 'small', name: 'Personal', icon: '🍕', price: '$8.99' },
    { value: 'medium', name: 'Mediana', icon: '🍕', price: '$12.99' },
    { value: 'large', name: 'Grande', icon: '🍕', price: '$15.99' },
    { value: 'xlarge', name: 'Familiar', icon: '🍕', price: '$18.99' }
  ];

  crustOptions = [
    { value: 'thin', name: 'Delgada', icon: '🥖', description: 'Crujiente y ligera' },
    { value: 'thick', name: 'Gruesa', icon: '🍞', description: 'Suave y esponjosa' },
    { value: 'stuffed', name: 'Rellena', icon: '🧀', description: 'Con queso en el borde' }
  ];

  toppingOptions = [
    { value: 'pepperoni', name: 'Pepperoni', icon: '🍕', price: '1.50' },
    { value: 'mushrooms', name: 'Champiñones', icon: '🍄', price: '1.00' },
    { value: 'olives', name: 'Aceitunas', icon: '🫒', price: '1.00' },
    { value: 'peppers', name: 'Pimientos', icon: '🌶️', price: '1.00' },
    { value: 'onions', name: 'Cebollas', icon: '🧅', price: '0.75' },
    { value: 'tomatoes', name: 'Tomates', icon: '🍅', price: '1.00' },
    { value: 'cheese', name: 'Queso Extra', icon: '🧀', price: '2.00' },
    { value: 'ham', name: 'Jamón', icon: '🥓', price: '2.00' }
  ];

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  selectCrust(crust: string) {
    this.selectedCrust.set(crust);
  }

  toggleTopping(topping: string) {
    const current = this.selectedToppings();
    if (current.includes(topping)) {
      this.selectedToppings.set(current.filter(t => t !== topping));
    } else {
      this.selectedToppings.set([...current, topping]);
    }
  }

  isSelected(topping: string): boolean {
    return this.selectedToppings().includes(topping);
  }

  canOrder(): boolean {
    return this.selectedSize() !== '' && this.selectedCrust() !== '';
  }

  getSelectedSizeName(): string {
    const size = this.sizeOptions.find(s => s.value === this.selectedSize());
    return size ? size.name : '';
  }

  getSelectedCrustName(): string {
    const crust = this.crustOptions.find(c => c.value === this.selectedCrust());
    return crust ? crust.name : '';
  }

  getSizePrice(): number {
    const size = this.sizeOptions.find(s => s.value === this.selectedSize());
    return size ? parseFloat(size.price.replace('$', '')) : 0;
  }

  getToppingsPrice(): number {
    return this.selectedToppings().reduce((total, topping) => {
      const toppingObj = this.toppingOptions.find(t => t.value === topping);
      return total + (toppingObj ? parseFloat(toppingObj.price) : 0);
    }, 0);
  }

  getTotal(): string {
    return (this.getSizePrice() + this.getToppingsPrice()).toFixed(2);
  }

  getSelectedToppingsNames(): string {
    return this.selectedToppings()
      .map(t => this.toppingOptions.find(opt => opt.value === t)?.name)
      .filter(Boolean)
      .join(', ');
  }
}