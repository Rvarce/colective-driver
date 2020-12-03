import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Ubicaciones } from "../interfaces/ubicaciones";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  private ubicacionesCollection: AngularFirestoreCollection<Ubicaciones>
  private ubicaciones: Observable<Ubicaciones[]>

  constructor(private db: AngularFirestore) {
    this.ubicacionesCollection = this.db.collection<Ubicaciones>('ubicaciones')

    this.ubicaciones = this.ubicacionesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
  }

  getUbicaciones(id) {
    return this.ubicacionesCollection.doc<Ubicaciones>(id).valueChanges()
  }
}
