import { Component } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {Router} from '@angular/router';
import {Usuario} from '../../models/usuario.models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent  {

  usuario: Usuario;

  constructor(private usuarioService: UsuarioService, private router: Router) {
    this.usuario = usuarioService.usuario;
  }




  logout(): void{
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }

  buscar(termino: string){

    if (termino.length === 0){
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }

}
