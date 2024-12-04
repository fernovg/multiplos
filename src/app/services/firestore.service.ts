import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; //es una extension que crea id

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  //todos: servicios
  firestore: Firestore = inject(Firestore);

  constructor() { }

  //* se crea una funcion generica para poder leer los datos de cualquier coleccion
  //* se actualiza automaticamente si existe un cambio en una coleccion
  traerColeccion<tipo>(path: string) {
    const refcollection = collection(this.firestore, path);
    return collectionData(refcollection) as Observable<tipo[]>
  }

  //* funcion generica para el registro en la base de datos
  crearDocumento(data:any, enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return setDoc(document, data);
  }

  //*funcion para la creacion de id automaticas
  crearIdDoc(){
    return uuidv4()
  }

}
