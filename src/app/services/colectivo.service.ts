import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Conductor } from "../interfaces/conductor";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rentabilidad } from '../interfaces/rentabilidad';
import { Fecha } from '../interfaces/fecha';


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

  updateCounter(id, subId, counter, income) {
    this.conductorRef.doc(id).collection('rentabilidad').doc(subId).update({ numPasajeros: counter, totalIngresos: income })
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

  getTimes(id) {
    // return this.conductorCollection.doc(id).collection('fechas', ref => ref.where('fecha', '==' , '14/01/2021')).get().toPromise()
    //   .then(res => {
    //     res.forEach(doc => {
    //       console.log('id', doc.id)
    //       return this.conductorRef.doc(id).collection<Fecha>('fechas').doc(doc.id).valueChanges()
    //     })
    //     }
    //   )
    //   .catch(err => console.error('Ocurrio un problema al eliminar ultmo timestamp ', err))

    return this.conductorRef.doc(id).collection<Fecha>('fechas', ref => ref.where('fecha', '==', '14/1/2021')).get().toPromise()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
  
      snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        return doc.data()
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
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

  actualizaDia(id) {
    var rentabilidad: Rentabilidad
    rentabilidad.timestamp = new Date()
    rentabilidad.numPasajeros = 0
    rentabilidad.totalGastos = 0
    rentabilidad.totalIngresos = 0

    this.conductorCollection.doc(id).collection('rentabilidad', ref => ref.orderBy('timestamp', 'asc').limitToLast(1)).get().toPromise()
      .then(res => {
        res.forEach(doc => {
          console.log(doc)
          if (!doc) {
            this.conductorCollection.doc(id).collection('rentabilidad').add(rentabilidad)
          } else {

          }
        })
      })
  }

}
