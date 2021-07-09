import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {UsuarioService} from '../services/usuario.service';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public usuarioService: UsuarioService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.usuarioService.token;

    // Si token no se enccuentra vacio, entonces lo revisa
    if (token != null) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });

      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
