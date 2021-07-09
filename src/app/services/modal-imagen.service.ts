import {EventEmitter, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  // tslint:disable-next-line:variable-name
  private _ocultarModal = true;

  public tipo: 'usuario'|'medico'|'hospital';
  public id: string;
  public img = 'sin-foto.png';

  // esta atenta a recibir emision
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(): boolean{
    return this._ocultarModal;
  }

  abrirModal(tipo: 'usuario'|'medico'|'hospital',
             id: string,
             img?: string): void {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    if (img){
      this.img = `${base_url}/upload/usuario/${img}`;
    }
  }

  cerrarModal(): void {
    this._ocultarModal = true;
  }


  constructor() { }
}
