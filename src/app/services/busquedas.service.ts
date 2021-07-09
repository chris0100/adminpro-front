import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Usuario} from '../models/usuario.models';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) {
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.id, user.nombre,
        user.email, '', user.role, user.img, user.google)
    );
  }


  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales',
         termino: string): Observable<any> {
    const url = `${base_url}/todo/${tipo}/${termino}`;
    return this.http.get<any>(url)
      .pipe(
        map(resp => {
          console.log(resp);
          switch (tipo) {

            case 'usuarios':
              return this.transformarUsuarios(resp.usuarios);

            case 'hospitales':
              return resp.hospitales;

            case 'medicos':
              return resp.medicos;

            default:
              return [];
          }
        })
      );
  }



  buscarGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get<any>(url);
  }

}
