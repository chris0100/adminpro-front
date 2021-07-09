import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Hospital} from '../models/hospital.model';
import {UsuarioService} from './usuario.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {



  constructor(private http: HttpClient) { }


  // Area para mantenimientos
  cargarHospitales(): Observable<Hospital[]> {
    const url = `${base_url}/hospitales`;
    return this.http.get(url)
      .pipe(
        map((resp: {hospitales: Hospital[]}) => resp.hospitales)
      );
  }


  creacionHospital(nombre: string, idUsuario: string): Observable<any> {
    const url = `${base_url}/hospitales/${idUsuario}`;
    return this.http.post(url, {nombre});
  }

  actualizarHospital(nombre: string, id: string): Observable<any> {
    const url = `${base_url}/hospitales/${id}`;
    console.log(url);
    return this.http.put(url, {nombre});
  }

  eliminarHospital(id: string): Observable<any> {
    const url = `${base_url}/hospitales/${id}`;
    return this.http.delete(url);
  }
}
