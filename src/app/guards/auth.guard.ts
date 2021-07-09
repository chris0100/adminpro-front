import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UsuarioService} from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {


  constructor(public usuarioService: UsuarioService, private router: Router) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Revisa que el usuario este autenticado
    if (this.usuarioService.isAuthenticated()) {

      // Revisa si el token ha expirado
      if (this.isTokenExpirado()) {
        this.usuarioService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }


  isTokenExpirado(): boolean {
    const token = this.usuarioService.token;
    const objPayload = this.usuarioService.obtenerDatosToken(token);
    const now = new Date().getTime() / 1000; // Obtiene la fecha actual en ms

    // Si la fecha es menor, significa que esta vencido, de lo contrario retorna false
    return objPayload.exp < now;
  }
}
