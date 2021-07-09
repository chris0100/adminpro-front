import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsuarioService} from '../../../services/usuario.service';
import {Usuario} from '../../../models/usuario.models';
import {BusquedasService} from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import {ModalImagenService} from '../../../services/modal-imagen.service';
import {delay} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;
  public cargando = true;
  public imgSubs: Subscription;

  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalService: ModalImagenService) {
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    // luego de que es emitida la imagen, realiza el subscribe
    this.imgSubs = this.modalService.nuevaImagen
      .subscribe(img => this.cargarUsuarios());
  }


  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }


  cambiarPagina(valor: number): void {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= (this.totalUsuarios / 5)) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }


  buscar(termino: string): void{
    if (termino.trim().length > 0){
      this.busquedaService.buscar('usuarios', termino)
        .subscribe(resp => {
          this.usuarios = resp;
        });
    } else{
      this.usuarios = this.usuariosTemp;
    }
  }


  eliminarUsuario(usuario: Usuario): void{

    if (usuario.id === this.usuarioService.id){
      Swal.fire('Restringido', 'No puedes borrarte a ti mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Esta seguro de eliminarlo?',
      text: 'Esta accion no puede ser revertida',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value){
        this.usuarioService.eliminarUsuario(usuario).subscribe(
          resp => {
            Swal.fire(
              'Eliminado',
              resp.mensaje,
              'success'
            );
            this.cargarUsuarios();
          }
        );
      }
    });
  }




  cambiarRole(usuario: Usuario): void{
    this.usuarioService.actualizarPerfil(usuario).subscribe(
      resp => {
        const usuarioSS = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
        if (usuarioSS.id === resp.usuario.id){
          const usuarioTemp = this.usuarioService.usuario;
          usuarioTemp.role = resp.usuario.role;
          usuarioTemp.id = usuarioSS.id;

          // Se guarda usuario en el ss
          sessionStorage.setItem('usuario', JSON.stringify(usuarioTemp));
        }
      }
    );
  }


  abrirModal(usuario: Usuario): void{
    console.log(usuario);
    this.modalService.abrirModal('usuario', usuario.id, usuario.img);
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


}
