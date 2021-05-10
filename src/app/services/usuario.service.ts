import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Usuario} from '../models/usuario.models';
import {RegisterForm} from '../interfaces/register-form.interface';
import {LoginForm} from '../interfaces/login-form.interface';
import {map} from 'rxjs/operators';

const base_url = environment.base_url;
const auth_url = environment.auth_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuario: Usuario;
  private token: string;

  constructor(private http: HttpClient) {
  }





  // Metodo Get para el usuario
  public get usuarioValidate(): Usuario {
    if (this.usuario != null) {
      return this.usuario;
    }

    // Se valida info en el localStorage
    else if (this.usuario == null && localStorage.getItem('usuario') != null) {
      this.usuario = JSON.parse(localStorage.getItem('usuario')) as Usuario;
      return this.usuario;
    }
    return null;
  }


  // Metodo Get para el token
  public get tokenValidate(): string {
    if (this.token != null) {
      return this.token;
    }

    // Se valida info en el localStorage
    else if (this.token == null && localStorage.getItem('token') != null) {
      this.token = localStorage.getItem('token');
      return this.token;
    }
    return null;
  }


  crearUsuario(formData: RegisterForm): Observable<Usuario> {
    return this.http.post<Usuario>(`${base_url}/usuarios`, formData);
  }


  login(formData: any, remember: boolean): Observable<Usuario> {

    if (remember){
      localStorage.setItem('email', formData.email);
    } else{
      localStorage.removeItem('email');
    }

    // Credenciales para entrada desde angular
    const credenciales = btoa('angularapp' + ':' + '12345');

    // Cabeceras
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales
    });

    // Parametros de inicio de sesion
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', formData.email);
    params.set('password', formData.password);

    return this.http.post<Usuario>(auth_url, params.toString(), {headers: httpHeaders});
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }


  guardarDataSession(accessToken: string): void {
    const objPayload = this.obtenerDatosToken(accessToken);

    this.usuario = new Usuario(objPayload.id, objPayload.nombre, objPayload.email,
      '', objPayload.authorities[0], objPayload.img, objPayload.google);

    this.token = accessToken;

    // Se guarda token en el localStorage
    localStorage.setItem('token', accessToken);

    // Se guarda usuario en el localStorage
    localStorage.setItem('usuario', JSON.stringify(this.usuario));

    // Se guarda id en el localstorage
    localStorage.setItem('id', objPayload.id);
  }


  isAuthenticated(): boolean {
    const objPayload = this.obtenerDatosToken(this.token);
    return objPayload != null && objPayload.user_name.length > 0;
  }



  logout(): void{
    this.token = null;
    this.usuario = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
  }
}
