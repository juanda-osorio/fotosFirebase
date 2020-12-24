import { FileItem } from './../../models/file-item';
import { Component, OnInit } from '@angular/core';
import { CargaImagenesService } from './../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: [
  ]
})
export class CargaComponent implements OnInit {

  archivos: FileItem [] = [];
  estaSobreElemento: boolean = false;

  constructor(public _cargaImagen: CargaImagenesService) { }

  ngOnInit(): void {
  }

  cargarImagenes(){
    this._cargaImagen.cargarImagenesFirebase( this.archivos );
  }

  limpiarArchivos(){
    this.archivos = [];
  }

  

}
