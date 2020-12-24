import { FileItem } from './../models/file-item';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private carpeta_imagenes = "img";


  constructor( private db: AngularFirestore,
               private storage: AngularFireStorage ) { }



  /* Esto espera un objeto */
  private guardarImagen( imagen: { nombre: string, url: string } ){

    this.db.collection(`/${ this.carpeta_imagenes }`)
        .add( imagen );
  }



  cargarImagenesFirebase( imagenes: FileItem[] ){

    for (const imagen of imagenes) {

        imagen.estaSubiendo = true;
  
        if (imagen.progreso >=100) {
          continue;
        }
  
        const fichero = imagen.archivo;
        const ruta = `${this.carpeta_imagenes}/${ imagen.nombreArchivo }`;
        const ref = this.storage.ref(ruta);
        const subida = ref.put(fichero);

        subida.percentageChanges()
        /* No sé por qué me obliga a ponerle 'any' */
          .subscribe( (resp:any) => {
            imagen.progreso = resp;
          });

        subida.snapshotChanges()
              .pipe(
                finalize( 
                  ()=> ref.getDownloadURL()                  
                  /* No sé por qué me obliga a ponerle 'string' */
                    .subscribe((url: string) =>{
                      console.log(`Imagen '${imagen.nombreArchivo}' cargada con éxito`);
                      imagen.url = url;
                      imagen.estaSubiendo = false;
                      this.guardarImagen({
                        nombre: imagen.nombreArchivo, 
                        url: imagen.url
                      })
                    })
                )
              ).subscribe();              
    }

  
  }




              
              













}
