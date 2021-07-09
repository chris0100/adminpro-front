import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Usuario} from '../models/usuario.models';
import {RegisterForm} from '../interfaces/register-form.interface';
import {delay, map} from 'rxjs/operators';
import {CargarUsuario} from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
const auth_url = environment.auth_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // tslint:disable-next-line:variable-name
  private _usuario: Usuario;
  // tslint:disable-next-line:variable-name
  private _token: string;

  constructor(private http: HttpClient) {
  }


  // Metodo Get para el usuario
  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    }

    // Se valida info en el localStorage
    else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
  }


  // Metodo Get para el token
  public get token(): string {
    if (this._token != null) {
      return this._token;
    }

    // Se valida info en el localStorage
    else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }


  crearUsuario(formData: RegisterForm): Observable<Usuario> {
    return this.http.post<Usuario>(`${base_url}/usuarios`, formData);
  }


  login(formData: any, remember: boolean): Observable<Usuario> {

    if (remember) {
      sessionStorage.setItem('email', formData.email);
    } else {
      sessionStorage.removeItem('email');
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

    this._usuario = new Usuario(objPayload.id, objPayload.nombre, objPayload.email,
      '', objPayload.authorities[0], objPayload.img, objPayload.google);

    if (this._usuario.img) {
      this._usuario.img = `${base_url}/upload/usuario/${this._usuario.img}`;
    } else {
      this._usuario.img = `${base_url}/upload/usuario/sin-foto.png`;
    }

    this._token = accessToken;

    // Se guarda token en el ss
    sessionStorage.setItem('token', accessToken);

    // Se guarda usuario en el ss
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

    // Se guarda id en el ss
    sessionStorage.setItem('id', objPayload.id);
  }


  isAuthenticated(): boolean {
    const objPayload = this.obtenerDatosToken(this.token);
    return objPayload != null && objPayload.user_name.length > 0;
  }

  get id(): string {
    return this._usuario.id;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('id');
  }


  actualizarPerfil(data: { email: string, nombre: string, role: string, id?: string }): Observable<any> {
/*    data = {
      ...data
    };*/
    let usuarioId = JSON.parse(sessionStorage.getItem('usuario')).id;
    if (data.id){
      usuarioId = data.id;
    }
    return this.http.put(`${base_url}/usuarios/${usuarioId}`, data);
  }


  // Area para mantenimientos
  cargarUsuarios(desde: number = 0): Observable<any> {
    const url = `${base_url}/usuarios/${desde}`;
    return this.http.get<CargarUsuario>(url)
      .pipe(
        delay(800),
        map(resp => {
          const usuarios = resp.usuarios.map(user => new Usuario(user.id, user.nombre,
            user.email, '', user.role, user.img, user.google));
          return {
            total: resp.total,
            usuarios
          };
        })
      );
  }


  eliminarUsuario(usuario: Usuario): Observable<any> {
    const url = `${base_url}/usuarios/${usuario.id}`;
    return this.http.delete(url);
  }
}














