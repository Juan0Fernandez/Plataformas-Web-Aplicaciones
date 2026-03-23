// src/app/features/formularios/pages/formulario-dinamico/formulario-dinamico.ts

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { FormUtils } from '../../../Utils/form-utils'; // Ajusta la ruta

@Component({
  selector: 'app-formulario-dinamico',
  templateUrl: './formulario-dinamico.html',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class FormularioDinamicoComponent { 
    
  private fb = inject(FormBuilder);
  public formUtils = FormUtils; // <-- Declaración clave

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],

    lenguajes: this.fb.array([
      this.fb.control('Python', [Validators.required, Validators.minLength(3)]),
      this.fb.control('Java', [Validators.required, Validators.minLength(3)]),
    ], Validators.minLength(3)) 
  });
    
  newLenguaje: FormControl = this.fb.control('', [Validators.required, Validators.minLength(3)]);

  get lenguajes(): FormArray {
    return this.myForm.get('lenguajes') as FormArray;
  }

  onAddToLenguajes() {
    if (this.newLenguaje.invalid) {
      this.newLenguaje.markAsTouched();
      return;
    }
    this.lenguajes.push(
      this.fb.control(this.newLenguaje.value, [Validators.required, Validators.minLength(3)])
    );

    this.newLenguaje.reset();
  }

  onDeleteLenguaje(index: number) {
    this.lenguajes.removeAt(index);
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    
    if (this.myForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    console.log('Formulario enviado:', this.myForm.value);
    alert('Formulario Dinámico válido. Datos enviados correctamente.');
  }
}