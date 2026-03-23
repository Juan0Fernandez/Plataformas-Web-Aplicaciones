// src/app/Utils/form-utils.ts

import { FormGroup, FormArray, ValidationErrors, AbstractControl } from '@angular/forms';

export class FormUtils {

    // --- MÉTODOS ESTÁNDARES (USADOS EN PRÁCTICAS 1 Y 3) ---

    static isValidField(form: FormGroup, fieldName: string): boolean | null {
        const control: AbstractControl | null = form.controls[fieldName];
        if (!control) return null;
        
        // Verifica si hay errores Y si el campo ha sido tocado
        return (
            !!control.errors && control.touched
        );
    }

    static getFieldError(form: FormGroup, fieldName: string): string | null {
        const control: AbstractControl | null = form.controls[fieldName];
        if (!control) return null;

        const errors = control.errors ?? {};
        return FormUtils.getTextError(errors);
    }

    // --- MÉTODOS PARA FORM-ARRAY (USADOS EN PRÁCTICA 2) ---

    static isValidFieldInArray(formArray: FormArray, index: number): boolean | null {
        const control: AbstractControl = formArray.controls[index];
        
        // Verifica si hay errores Y si el campo ha sido tocado
        return (
            !!control.errors && control.touched
        );
    }

    static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
        if (formArray.controls.length === 0) return null;

        const errors = formArray.controls[index].errors ?? {};
        return FormUtils.getTextError(errors);
    }

    // --- LÓGICA CENTRAL DE TRADUCCIÓN DE ERRORES ---

    static getTextError(errors: ValidationErrors): string | null {
        for (const key of Object.keys(errors)) {
            switch (key) {
                case 'required':
                    return 'Este campo es obligatorio.';

                case 'requiredTrue': // Agregado para el checkbox de 'condiciones'
                    return 'Debe aceptar los términos y condiciones.';

                case 'minlength':
                    return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;

                case 'min':
                    return `El valor mínimo es ${errors['min'].min}`;

                case 'email':
                    return 'Formato de correo inválido.';

                default:
                    return 'Error de validación no controlado.';
            }
        }
        return null;
    }
}