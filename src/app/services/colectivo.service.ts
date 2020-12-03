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
    return this.db.collection('conductor').doc(id).collection<Rentabilidad>('rentabilidad').doc(subId).valueChanges()
  }



}
