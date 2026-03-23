import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule } from '@angular/forms';
import { FormUtils } from '../../../Utils/form-utils';

@Component({
  selector: 'app-formulariopage',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Formulariopage {

  public formUtils = FormUtils;
  nombre: any;

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Datos de formulario:', this.myForm.value);
    alert('Formulario valido. Datos enviados correctamente.');
    this.myForm.reset();
  }


  private fb = inject(FormBuilder);

  myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    edad: [0, [Validators.required, Validators.min(18)]],
    correo: ['', [Validators.required, Validators.email]],
  });

  osValidField(fieldName: string): boolean | null {
    return (
      this.myForm.controls[fieldName].errors &&
      this.myForm.controls[fieldName].touched
    );
  }



  getFieldError(fieldName: string): string | null {
    if (!this.myForm.controls[fieldName]) return null;
    const errors = this.myForm.controls[fieldName].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio.';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `El valor mínimo es ${errors['min'].min}.`;
        case 'email':
          return 'Formato de correo inválido.';
        default:
          return 'Campo inválido.';
      }
    }
    return null;   
}

}

