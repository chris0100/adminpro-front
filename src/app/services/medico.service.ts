import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Hospital} from '../models/hospital.model';
import {Medico} from '../models/medico.model';
import {Observable} from 'rxjs';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})

export class MedicoService {

  constructor(private http: HttpClient) { }


  cargarMedicos(): Observable<Medico[]>{
    const url = `${base_url}/medicos`;
    return this.http.get(url)
      .pipe(
        map((resp: {medicos: Medico[]}) => resp.medicos)
      );
  }

  obtenerMedicoById(id: string): Observable<any> {
    const url = `${base_url}/medicos/${id}`;
    return this.http.get(url);
  }


  creacionMedicos(medico: Medico): Observable<any> {
    const url = `${base_url}/medicos?idHospital=${medico.hospital.id}&idUsuario=${medico.usuario.id}`;
    console.log(url);
    return this.http.post(url, medico);
  }



  actualizarMedicos(medico: Medico): Observable<any> {
    console.log(medico);
    const url = `${base_url}/medicos/${medico.id}`;
    console.log(url);
    return this.http.put(url, medico);
  }



  eliminarMedicos(id: string): Observable<any> {
    const url = `${base_url}/medicos/${id}`;
    return this.http.delete(url);
  }
}
