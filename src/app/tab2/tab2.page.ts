import { Component, inject } from '@angular/core';
import { dMultiplos } from '../models/datos.models';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  //ToDos: Servicios 
  private fireServices = inject(FirestoreService);

  datosmultiplos: dMultiplos[] = []

  constructor() {
    this.cargarMultiplos()
  }

  //funcion para traer los datos de de la base datos
  cargarMultiplos(){
    this.fireServices.traerColeccion<dMultiplos>('DatosMultiplos').subscribe( data => {
      this.datosmultiplos = data;
    })
  }

}
