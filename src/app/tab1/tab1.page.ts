import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../services/validators.service';
import { dMultiplos } from '../models/datos.models';
import { FirestoreService } from '../services/firestore.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //ToDos: Servicios 
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private fireServices = inject(FirestoreService);
  private toastController = inject(ToastController);

  //TodOs: Formulario
  public myForm: FormGroup = this.fb.group({
    num: ['', [Validators.required, this.validatorsService.esEntero]]
  })

  public resultados: any[] = [];
  // public numeros: any[] = [];
  nuevoMulti: dMultiplos;
  cargando: boolean = false;

  constructor() { }

  //funcion para sacar los multiplos y presentarlo al usuario
  scarMultiplo() {
    //verificamos que el form sea valido
    if (this.myForm.valid) {
      const { num } = this.myForm.value; //se obtiene el numero que el usuario ingreso

      // se limpia el array para sacar nuevo multiplo
      this.resultados = [];

      // se crea multiples como un objeto con propiedades de tipo array de números
      const multiples: {[key: number]: number[]} = {
        3: [],
        5: [],
        7: []
      };

      // buscamos los multiplos del numero ingresado 
      for (let i = 1; i <= num; i++) {
        if (i % 3 === 0) multiples[3].push(i); //se agrega al array correspondiente
        if (i % 5 === 0) multiples[5].push(i);
        if (i % 7 === 0) multiples[7].push(i);
      }

      // se crea la lista para mostrar al usuario
      for (let i = 0; i <= num; i++) {
        let colorClass;  // por defecto se muestra en negro (o blanco en dark mode)

        // verifica los multiplos para asignar el color
        if (multiples[3].includes(i) || multiples[5].includes(i) || multiples[7].includes(i)) {
          if (multiples[3].includes(i)) {
            colorClass = 'verde'; // multiplo de 3 es verde
          }
          if (multiples[5].includes(i)) {
            colorClass = 'rojo'; // multiplo de 5 es rojo
          }
          if (multiples[7].includes(i)) {
            colorClass = 'azul'; // multiplo de 7 es azul
          }
        }
        // almacena el resultado con su color
        this.resultados.push({ numero: i, color: colorClass });
      }
     //se llama la funcion para interaccion con la base de datos, se envia el numero que agg el usuario y el objeto multiples
      this.procesarMultiples(num, multiples);
    }
  }

  // funciona para crear el formato de guardado en base de datos
  procesarMultiples(num: number, multiples: { [key: number]: number[] }) {
    let numeros: { numeros: number[], } = { numeros: [] };
    // for para buscar los multiplos
    for (let i = 1; i <= num; i++) {
      numeros.numeros.push(i); //guardamos la serie de numeros
    }
    // metemos los datos al formato que se enviara
    this.nuevoMulti = {
      id: this.fireServices.crearIdDoc(),
      peticion: num,
      numeros: `${numeros.numeros.join(', ')}`,
      multi3: `${num}[3] (${multiples[3].join(', ')})`,
      multi5: `${num}[5] (${multiples[5].join(', ')})`,
      multi7: `${num}[7] (${multiples[7].join(', ')})`
    }
  }

  //funcion para guardar los datos en la base datos
  async guardarMultiplos() {
    this.cargando = true;
    await this.fireServices.crearDocumento(this.nuevoMulti, 'DatosMultiplos', this.nuevoMulti.id)
    this.cargando = false;
    //cargamos mensaje al confirmar su agregacion
    const toast = await this.toastController.create({
      message: 'Multiplo Registrado Con Exito',
      color: 'success',
      duration: 1000,
    });
    await toast.present();
  }

}