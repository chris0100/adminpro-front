import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {Usuario} from '../../models/usuario.models';
import Swal from 'sweetalert2';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      role: [this.usuario.role]
    });

  }



  actualizarPerfil(): void{
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      () => {
        Swal.fire('Guardado', 'El usuario se ha editado correctamente', 'success');

        const {nombre, email} = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
      }, (err) => {
        Swal.fire('Error', err.error.mensaje, 'error');
      });
  }


  cambiarImagen(file: File): void{
    this.imagenSubir = file;

    if (!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }


  subirImagen(): void{
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuario', this.usuario.id)
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'La imagen se ha actualizado correctamente', 'success');
      }).catch( err => {
        Swal.fire('Error', 'No se pudo cargar la imagen', 'error');
    });
  }

}
