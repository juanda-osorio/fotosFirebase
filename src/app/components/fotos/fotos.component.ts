import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface Imagen{ nombre: string; url: string; }

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: [
  ]
})
export class FotosComponent implements OnInit {
  
  private itemsCollection: AngularFirestoreCollection<Imagen>;
  public  imagenes: Observable<Imagen[]>;

  constructor( private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Imagen>('img');
    this.imagenes = this.itemsCollection.valueChanges();
  }

  ngOnInit(): void {
  }

}
