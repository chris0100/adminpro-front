import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() {
  }


  // tslint:disable-next-line:typedef
  async actualizarFoto(archivo: File, tipo: 'usuario' | 'medico' | 'hospital',
                       id: string) {
    try {

      const url = `${base_url}/upload?id=${id}&tipo=${tipo}`;

      console.log(url);

      const formData = new FormData();
      formData.append('archivo', archivo);

      // realiza el fecth utilizando el await para llamar al metodo post
      const resp = await fetch(url, {
        method: 'POST',
        body: formData
      });

      // se asigna el json de la respuesta
      const data = await resp.json();
      console.log(data);

      if (data.mensaje) {
        if (data.hospital || data.medico) {
          return false;
        }
        else if (data.usuario.img) {
          data.usuario.img = `${base_url}/upload/usuario/${data.usuario.img}`;
        } else {
          data.usuario.img = `${base_url}/upload/usuario/sin-foto.png`;
        }

        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        return data.usuario.img;
      } else {
        console.log(data);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
