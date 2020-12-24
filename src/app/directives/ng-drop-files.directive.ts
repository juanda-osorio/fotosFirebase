import { FileItem } from './../models/file-item';
import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  
  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();


  constructor() { }

  @HostListener('dragover', ['$event'])
  public alEntrar( event: any ){
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public alSalir( event: any ){
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public alSoltar( event: any ){    
    const transferencia = this._getTransferencia( event );
    if (!transferencia) {
      return;
    }
    // 'transferencia.files' ==> es una propiedad del objeto devuelto en _getTransferencia
    this._extraerArchivos(transferencia.files);

    this._prevenirDetener(event);
    this.mouseSobre.emit(false);
  }


  /* dataTransfer es un objeto que se usa cuando se realiza una operacion 'drag and drop' */
  private _getTransferencia ( event: any){
    return event.dataTransfer ?  event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList){
    /* Objcet.getOwnPropertyNames ==> devuelve los nombre de los campos de un objeto, 
    *  en este caso son numeros, por eso se hace el bucle y luego se accede al objeto en concreto
    *  a través de su nombre (0 o 1) y se guardan sus propiedades en 'archivoTeporal' */
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      if (this._archivoPuedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push( nuevoArchivo );
      }
    }
  }


  // Validaciones

  private _archivoPuedeSerCargado( archivo: File ): boolean{
    if (!this._archivoYaFueSubido( archivo.name ) && this._esImagen(archivo.type) ) {
      return true;
    }else{
      return false;
    }
  }

  private _prevenirDetener( event: any ){
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueSubido( nombreArchivo: string ): boolean{
    for(const archivo of this.archivos){
      if( archivo.nombreArchivo == nombreArchivo ){
        console.log("El archivo '"+nombreArchivo+"' ya está agregado");
        return true;
      }
    }
    return false;
  }

  /* startsWith?? */
  private _esImagen( tipoArchivo: string ): boolean{
    return ( tipoArchivo == "" || tipoArchivo == undefined ) ? false : tipoArchivo.startsWith('image');
  }



}
