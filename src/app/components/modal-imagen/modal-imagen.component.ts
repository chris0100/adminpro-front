import { Component, OnInit } from '@angular/core';
import {ModalImagenService} from '../../services/modal-imagen.service';
import Swal from 'sweetalert2';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {


  public imagenSubir: File;
  public imgTemp: any = null;


  constructor(public modalService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.imgTemp = null;
    this.modalService.cerrarModal();
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

    const id = this.modalService.id;
    const tipo = this.modalService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
      .then(img => {
        Swal.fire('Guardado', 'La imagen se ha actualizado correctamente', 'success');
        // emite la nueva imagen guardada.
        this.modalService.nuevaImagen.emit(img);

        this.cerrarModal();
      }).catch( err => {
      Swal.fire('Error', 'No se pudo cargar la imagen', 'error');
    });
  }

}
