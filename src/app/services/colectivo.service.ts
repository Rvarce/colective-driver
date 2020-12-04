import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Conductor } from "../interfaces/conductor";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rentabilidad } from '../interfaces/rentabilidad';


@Injectable({
  providedIn: 'root'
})
export class ColectivoService {
  private conductorCollection: AngularFirestoreCollection<Conductor>
  private conductor: Observable<Conductor[]>
  private conductorRef = this.db.collection('conductor')

  constructor(private db: AngularFirestore) {
    this.conductorCollection = this.db.collection<Conductor>('conductor')

    this.conductor = this.conductorCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
  }

  getConductor(id) {
    //  return this.conductorCollection.doc(id).get()
    return this.conductorCollection.doc<Conductor>(id).valueChanges()

  }
  updatePosition(id, coords) {
    this.conductorCollection.doc(id).update({ posicionActual: coords })
  }

  getRentabilidad(id, subId) {
    return this.conductorRef.doc(id).collection<Rentabilidad>('rentabilidad').doc(subId).valueChanges()
  }

  updateCounter(id, subId, counter) {
    this.conductorRef.doc(id).collection('rentabilidad').doc(subId).update({ numPasajeros: counter })
  }

  saveTime(id, date) {
    let subid = date.fecha.split('/').join('') + date.hora.split(':').join('')
    let timestamp = new Date()
    console.log(subid)
    this.conductorRef.doc(id).collection('fechas').doc(subid).set({
      timestamp: timestamp,
      fecha: date.fecha,
      hora: date.hora
    })
  }

  deleteLast(id) {

    this.conductorCollection.doc(id).collection('fechas', ref => ref.orderBy('timestamp', 'asc').limitToLast(1)).get().toPromise()
      .then(res => {
          res.forEach(doc => {
            console.log(doc.id)
            this.conductorRef.doc(id).collection('fechas').doc(doc.id).delete()
          })
        }
      )
      .catch(err => console.error('Ocurrio un problema al eliminar ultmo timestamp ', err))

  }

}
