import { Component } from '@angular/core';
import {SidebarService} from '../../services/sidebar.service';
import {UsuarioService} from '../../services/usuario.service';
import {Usuario} from '../../models/usuario.models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent  {

  menuItems: any[];
  usuario: Usuario;

  constructor(private sidebarService: SidebarService, private usuarioService: UsuarioService) {
    this.menuItems = sidebarService.menu;
    this.usuario = usuarioService.usuario;
  }


}
