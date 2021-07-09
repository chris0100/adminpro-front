import {environment} from '../../environments/environment';

const base_url = environment.base_url;

export class Usuario {

  constructor(
    public id: string,
    public nombre: string,
    public email: string,
    public password: string,
    public role: string,
    public img?: string,
    public google?: boolean
  ) {
  }

  get imagenUrl(): string{
    if (this.img){
      return `${base_url}/upload/usuario/${this.img}`;
    }
    else {
     return `${base_url}/upload/usuario/sin-foto.png`;
    }
  }
}



