import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  // Validador de número entero
  public esEntero(control: FormControl): ValidationErrors | null {
    const value = control.value;
    // Verificar si el valor es un número entero
    if (value && !Number.isInteger(Number(value))) {
      return { 'notInteger': true }; // Retorna un error si no es un número entero
    }
    return null; // Si es un número entero, retorna null (sin error)
  }

}
