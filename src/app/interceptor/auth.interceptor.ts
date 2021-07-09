import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {UsuarioService} from '../services/usuario.service';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public usuarioService: UsuarioService, private router: Router) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {

          // Si ha vencido el token, pero sigue autenticado por parte de angular
          // por lo tanto se cierra con el metodo logout()
          if (this.usuarioService.isAuthenticated()) {
            this.usuarioService.logout();
            this.router.navigate(['/login']);
          }
        }

        if (err.status === 403) {
          Swal.fire('Acceso Denegado', `${this.usuarioService.usuario.nombre}, No tienes permiso para acceder a este recurso`, 'warning');
          this.router.navigate(['/dashboard']);
        }
        return throwError(err);
      }));
  }
}
